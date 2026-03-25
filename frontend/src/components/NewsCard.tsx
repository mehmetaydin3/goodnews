import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Share2, Calendar, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'
import type { Article } from '../types'
import { trackEvent } from '../api/client'

interface NewsCardProps {
  article: Article
  variant?: 'default' | 'featured'
}

const SENTIMENT_COLORS = {
  POSITIVE:  'from-emerald-500 to-teal-500',
  UPLIFTING: 'from-pink-500 to-rose-500',
  INSPIRING: 'from-amber-500 to-orange-500',
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60'

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  const navigate = useNavigate()

  const handleClick = async () => {
    await trackEvent(article.id, 'click')
    navigate(`/article/${article.id}`)
  }

  const publishedAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
  })

  const sentiment = article.summary?.sentiment ?? 'POSITIVE'
  const gradientClass = SENTIMENT_COLORS[sentiment]

  if (variant === 'featured') {
    return (
      <motion.article
        whileHover={{ scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover cursor-pointer bg-white transition-shadow duration-300"
        onClick={handleClick}
        role="article"
        aria-label={article.title}
      >
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img
            src={article.imageUrl ?? FALLBACK_IMAGE}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE
            }}
          />
          <div className={clsx('absolute inset-0 bg-gradient-to-t', 'from-gray-900/80 via-gray-900/20 to-transparent')} />

          {article.category && (
            <div className="absolute top-4 left-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-lg"
                style={{ backgroundColor: article.category.color + 'dd' }}
              >
                <span>{article.category.emoji}</span>
                <span>{article.category.name}</span>
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight text-balance mb-2">
              {article.title}
            </h2>
            {article.summary?.shortSummary && (
              <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-3">
                {article.summary.shortSummary}
              </p>
            )}
            <div className="flex items-center gap-4 text-gray-300 text-xs">
              <span className="font-medium">{article.source}</span>
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
            'absolute top-0 left-0 w-1 h-full bg-gradient-to-b',
            gradientClass
          )}
        />
      </motion.article>
    )
  }

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
        <img
          src={article.imageUrl ?? FALLBACK_IMAGE}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE
          }}
        />
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
                'inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white',
                'bg-gradient-to-r',
                gradientClass
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
          gradientClass
        )}
      />
    </motion.article>
  )
}
