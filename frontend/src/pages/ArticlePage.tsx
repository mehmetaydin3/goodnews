import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Eye, ExternalLink, Loader2 } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import NewsCard from '../components/NewsCard'
import ShareMenu from '../components/ShareMenu'
import { getArticle, getArticles, trackEvent } from '../api/client'
import type { Article } from '../types'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=70'

const SENTIMENT_LABELS = {
  POSITIVE: { label: 'Positive News', color: 'bg-emerald-100 text-emerald-700', emoji: '😊' },
  UPLIFTING: { label: 'Uplifting Story', color: 'bg-pink-100 text-pink-700', emoji: '💚' },
  INSPIRING: { label: 'Inspiring Achievement', color: 'bg-amber-100 text-amber-700', emoji: '🌟' },
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: article,
    isLoading,
    isError,
  } = useQuery<Article>({
    queryKey: ['article', id],
    queryFn: () => getArticle(id!),
    enabled: !!id,
  })

  const { data: relatedData } = useQuery({
    queryKey: ['articles', { category: article?.category?.slug, excludeId: id }],
    queryFn: () =>
      getArticles({
        category: article?.category?.slug,
        limit: 4,
      }),
    enabled: !!article?.category?.slug,
  })

  const relatedArticles = (relatedData?.data ?? [])
    .filter((a) => a.id !== id)
    .slice(0, 3)

  useEffect(() => {
    if (article?.id) {
      trackEvent(article.id, 'view')
    }
  }, [article?.id])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={36} className="animate-spin text-brand-500" />
        <p className="text-gray-500 font-medium">Loading story…</p>
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-5xl">😕</div>
        <h1 className="text-xl font-semibold text-gray-700">Story not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-brand-600 hover:underline font-medium"
        >
          <ArrowLeft size={16} />
          Go back
        </button>
      </div>
    )
  }

  const sentiment = article.summary?.sentiment ?? 'POSITIVE'
  const sentimentInfo = SENTIMENT_LABELS[sentiment]
  const publishedDate = new Date(article.publishedAt)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} />
          Back to stories
        </button>

        <ShareMenu article={article} />
      </div>

      <article>
        {article.imageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl mb-8 aspect-video"
          >
            <img
              src={article.imageUrl ?? FALLBACK_IMAGE}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.category && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: article.category.color }}
              >
                <span>{article.category.emoji}</span>
                <span>{article.category.name}</span>
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${sentimentInfo.color}`}
            >
              <span>{sentimentInfo.emoji}</span>
              <span>{sentimentInfo.label}</span>
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight text-balance mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
            <span className="font-semibold text-gray-700">{article.source}</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              <time dateTime={publishedDate.toISOString()}>
                {format(publishedDate, 'MMMM d, yyyy')}
              </time>
              <span className="text-gray-400">
                ({formatDistanceToNow(publishedDate, { addSuffix: true })})
              </span>
            </span>
            {article.analytics && (
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {article.analytics.views.toLocaleString()} reads
              </span>
            )}
          </div>
        </motion.div>

        {article.summary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-5 mb-8"
          >
            <blockquote className="relative pl-6 border-l-4 border-brand-400 bg-brand-50 rounded-r-xl py-5 pr-5">
              <div className="absolute -left-3 top-4 w-6 h-6 rounded-full bg-brand-400 flex items-center justify-center text-white text-xs font-bold">
                "
              </div>
              <p className="text-gray-800 text-lg leading-relaxed font-medium italic">
                {article.summary.longSummary}
              </p>
            </blockquote>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <h2 className="font-bold text-emerald-800 text-sm uppercase tracking-wider">
                  Why This Matters
                </h2>
              </div>
              <p className="text-emerald-900 font-medium leading-relaxed">
                {article.summary.keyTakeaway}
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="prose prose-gray max-w-none mb-8"
        >
          {article.cleanContent.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4 text-base">
              {paragraph}
            </p>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-gray-100 mb-10"
        >
          <div className="flex items-center gap-3">
            <ShareMenu article={article} />
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent(article.id, 'click')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ExternalLink size={15} />
              Read original
            </a>
          </div>
          <span className="text-sm text-gray-400">
            Source: {article.source}
          </span>
        </motion.div>
      </article>

      {relatedArticles.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              {article.category?.emoji} More {article.category?.name ?? 'Good'} Stories
            </h2>
            {article.category && (
              <Link
                to={`/category/${article.category.slug}`}
                className="text-brand-600 hover:text-brand-700 text-sm font-medium hover:underline"
              >
                See all →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedArticles.map((related) => (
              <NewsCard key={related.id} article={related} />
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  )
}
