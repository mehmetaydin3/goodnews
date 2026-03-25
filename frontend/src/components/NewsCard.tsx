import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Share2, Calendar, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'
import type { Article } from '../types'
import { trackEvent } from '../api/client'

interface NewsCardProps {
  article: Article
  /** featured: full-width hero overlay | secondary: tall left-column card | default: grid card */
  variant?: 'default' | 'featured' | 'secondary'
}

const SENTIMENT_GRADIENT = {
  POSITIVE:  'from-emerald-500 to-teal-500',
  UPLIFTING: 'from-pink-500 to-rose-500',
  INSPIRING: 'from-amber-500 to-orange-500',
}

const CATEGORY_PLACEHOLDER_GRADIENT: Record<string, string> = {
  'Science & Nature':   'from-blue-600 to-cyan-500',
  'Health & Medicine':  'from-green-600 to-emerald-500',
  'Community & Society':'from-pink-600 to-rose-500',
  'Innovation & Tech':  'from-violet-600 to-purple-500',
  'Environment':        'from-teal-600 to-green-500',
  'Sports & Achievement':'from-orange-600 to-amber-500',
  'Arts & Culture':     'from-fuchsia-600 to-pink-500',
  'Business & Economy': 'from-slate-600 to-gray-500',
  'Education':          'from-indigo-600 to-blue-500',
  'World Affairs':      'from-red-600 to-rose-500',
}

function CategoryPlaceholder({
  article,
  className,
}: {
  article: Article
  className?: string
}) {
  const catName = article.category?.name ?? ''
  const gradient =
    CATEGORY_PLACEHOLDER_GRADIENT[catName] ?? 'from-emerald-600 to-teal-500'
  return (
    <div
      className={clsx(
        'w-full h-full flex flex-col items-center justify-center bg-gradient-to-br',
        gradient,
        className
      )}
    >
      <span className="text-5xl mb-2 opacity-90 select-none">
        {article.category?.emoji ?? '✨'}
      </span>
      {catName && (
        <span className="text-white/60 text-xs font-semibold uppercase tracking-widest px-4 text-center">
          {catName}
        </span>
      )}
    </div>
  )
}

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    trackEvent(article.id, 'click') // fire-and-forget, never block navigation
    navigate(`/article/${article.id}`)
  }

  const publishedAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
  })

  const sentiment = article.summary?.sentiment ?? 'POSITIVE'
  const sentimentGradient = SENTIMENT_GRADIENT[sentiment]
  const imageSrc = article.imageUrl ?? article.images?.[0] ?? null
  const hasImage = !!imageSrc

  // ─── FEATURED (full-width hero) ────────────────────────────────────────────
  if (variant === 'featured') {
    return (
      <motion.article
        whileHover={{ scale: 1.003 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover cursor-pointer bg-white transition-shadow duration-300"
        onClick={handleClick}
        role="article"
        aria-label={article.title}
      >
        <div className="relative h-80 md:h-[26rem] overflow-hidden">
          {hasImage ? (
            <img
              src={imageSrc!}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget
                el.style.display = 'none'
                el.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={clsx('absolute inset-0', hasImage ? 'hidden' : '')}>
            <CategoryPlaceholder article={article} className="h-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-900/30 to-transparent" />

          {article.category && (
            <div className="absolute top-5 left-5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white shadow-lg backdrop-blur-sm"
                style={{ backgroundColor: article.category.color + 'cc' }}
              >
                <span>{article.category.emoji}</span>
                <span>{article.category.name}</span>
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-2">
              Featured Story
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight text-balance mb-3">
              {article.title}
            </h2>
            {article.summary?.shortSummary && (
              <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl">
                {article.summary.shortSummary}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-xs">
              <span className="font-semibold text-white/90">{article.source}</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {publishedAgo}
              </span>
              {article.analytics && (
                <>
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {article.analytics.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 size={12} />
                    {article.analytics.shares.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={clsx(
            'absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b',
            sentimentGradient
          )}
        />
      </motion.article>
    )
  }

  // ─── SECONDARY (tall left-column card) ─────────────────────────────────────
  if (variant === 'secondary') {
    return (
      <motion.article
        whileHover={{ scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="group relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover cursor-pointer bg-white transition-shadow duration-300 h-full flex flex-col"
        onClick={handleClick}
        role="article"
        aria-label={article.title}
      >
        <div className="relative flex-1 min-h-48 overflow-hidden">
          {hasImage ? (
            <img
              src={imageSrc!}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget
                el.style.display = 'none'
                el.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={clsx('absolute inset-0', hasImage ? 'hidden' : '')}>
            <CategoryPlaceholder article={article} className="h-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-900/10 to-transparent" />

          {article.category && (
            <div className="absolute top-3 left-3">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: article.category.color + 'dd' }}
              >
                <span>{article.category.emoji}</span>
                <span>{article.category.name}</span>
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-bold text-white text-base leading-snug line-clamp-3 mb-1.5 group-hover:text-emerald-200 transition-colors">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-300 text-xs">
              <span className="font-medium">{article.source}</span>
              <span>·</span>
              <span>{publishedAgo}</span>
            </div>
          </div>
        </div>

        {article.summary?.shortSummary && (
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-gray-500 text-sm line-clamp-2">
              {article.summary.shortSummary}
            </p>
          </div>
        )}

        <div
          className={clsx(
            'absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            sentimentGradient
          )}
        />
      </motion.article>
    )
  }

  // ─── DEFAULT (grid card) ────────────────────────────────────────────────────
  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative flex flex-col overflow-hidden rounded-xl shadow-card bg-white cursor-pointer transition-shadow duration-300 h-full"
      onClick={handleClick}
      role="article"
      aria-label={article.title}
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        {hasImage ? (
          <img
            src={imageSrc!}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const el = e.currentTarget
              el.style.display = 'none'
              el.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={clsx('absolute inset-0', hasImage ? 'hidden' : '')}>
          <CategoryPlaceholder article={article} className="h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {article.category && (
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: article.category.color + 'ee' }}
            >
              <span>{article.category.emoji}</span>
              <span>{article.category.name}</span>
            </span>
          </div>
        )}

        {article.summary && (
          <div className="absolute top-3 right-3">
            <span
              className={clsx(
                'inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r',
                sentimentGradient
              )}
            >
              {sentiment === 'POSITIVE' ? '😊' : sentiment === 'UPLIFTING' ? '💚' : '🌟'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors">
          {article.title}
        </h3>

        {article.summary?.shortSummary && (
          <p className="text-gray-500 text-sm line-clamp-2 flex-1 mb-3">
            {article.summary.shortSummary}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600 truncate max-w-[100px]">
              {article.source}
            </span>
            <span className="flex items-center gap-0.5">
              <Calendar size={11} />
              {publishedAgo}
            </span>
          </div>
          {article.analytics && (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-0.5">
                <Eye size={11} />
                {article.analytics.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-0.5">
                <Share2 size={11} />
                {article.analytics.shares.toLocaleString()}
              </span>
            </div>
          )}
          <ExternalLink
            size={13}
            className="text-gray-300 group-hover:text-brand-500 transition-colors flex-shrink-0"
          />
        </div>
      </div>

      <div
        className={clsx(
          'absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          sentimentGradient
        )}
      />
    </motion.article>
  )
}
