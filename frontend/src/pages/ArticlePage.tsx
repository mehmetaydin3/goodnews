import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Calendar, Eye, ExternalLink, Loader2,
  Clock, CheckCircle2, ChevronRight, X,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import NewsCard from '../components/NewsCard'
import ShareMenu from '../components/ShareMenu'
import { getArticle, getArticles, trackEvent } from '../api/client'
import type { Article } from '../types'

const SENTIMENT_CONFIG = {
  POSITIVE:  { label: 'Positive', color: '#059669', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', emoji: '😊' },
  UPLIFTING: { label: 'Uplifting', color: '#db2777', bg: 'bg-pink-50',   text: 'text-pink-700',    border: 'border-pink-200',    emoji: '💚' },
  INSPIRING: { label: 'Inspiring', color: '#d97706', bg: 'bg-amber-50',  text: 'text-amber-700',   border: 'border-amber-200',   emoji: '🌟' },
}

function readTime(text: string) {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

/** Scatter inline images through paragraphs — one image every N paragraphs */
function interleavedContent(paragraphs: string[], images: string[]) {
  const inlineImgs = images.slice(1, 6) // skip hero, use up to 5 extras
  const interval = inlineImgs.length > 0 ? Math.max(3, Math.ceil(paragraphs.length / inlineImgs.length)) : Infinity
  const result: Array<{ type: 'p'; text: string } | { type: 'img'; src: string }> = []
  let imgIdx = 0
  paragraphs.forEach((p, i) => {
    result.push({ type: 'p', text: p })
    if ((i + 1) % interval === 0 && imgIdx < inlineImgs.length) {
      result.push({ type: 'img', src: inlineImgs[imgIdx++] })
    }
  })
  return result
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState<string | null>(null)

  const { data: article, isLoading, isError } = useQuery<Article>({
    queryKey: ['article', id],
    queryFn: () => getArticle(id!),
    enabled: !!id,
  })

  const { data: relatedData } = useQuery({
    queryKey: ['articles', { category: article?.category?.slug, excludeId: id }],
    queryFn: () => getArticles({ category: article?.category?.slug, limit: 4 }),
    enabled: !!article?.category?.slug,
  })

  const relatedArticles = (relatedData?.data ?? []).filter((a) => a.id !== id).slice(0, 3)

  useEffect(() => {
    if (article?.id) trackEvent(article.id, 'view')
  }, [article?.id])

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={36} className="animate-spin text-emerald-500" />
        <p className="text-gray-500 font-medium">Loading story…</p>
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-5xl">😕</div>
        <h1 className="text-xl font-semibold text-gray-700">Story not found</h1>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:underline font-medium">
          <ArrowLeft size={16} />Go back
        </button>
      </div>
    )
  }

  const sentiment = article.summary?.sentiment ?? 'POSITIVE'
  const sc = SENTIMENT_CONFIG[sentiment]
  const publishedDate = new Date(article.publishedAt)
  const mins = readTime(article.cleanContent)

  const allImages = [
    ...(article.imageUrl ? [article.imageUrl] : []),
    ...(article.images ?? []).filter((img) => img !== article.imageUrl),
  ]
  const heroSrc = allImages[activeImg] ?? null

  const paragraphs = article.cleanContent
    .split(/\n\n+|\n(?=[A-Z""])/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40)

  const contentBlocks = interleavedContent(paragraphs, allImages)
  const tldr = article.summary?.tldr ?? []

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X size={28} />
            </button>
            <img
              src={lightbox} alt=""
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>

        {/* ── Nav bar ───────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={15} />Back to stories
          </button>
          <ShareMenu article={article} />
        </div>

        {/* ── Hero image (full-bleed within content column) ─ */}
        <div className="max-w-5xl mx-auto px-4 mb-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative overflow-hidden rounded-2xl bg-gray-100"
            style={{ aspectRatio: '21/9' }}
          >
            {heroSrc ? (
              <img
                key={heroSrc} src={heroSrc} alt={article.title}
                className="w-full h-full object-cover cursor-zoom-in"
                loading="eager" fetchPriority="high" decoding="async"
                onClick={() => setLightbox(heroSrc)}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <div
              className={['absolute inset-0 flex flex-col items-center justify-center', heroSrc ? 'hidden' : ''].join(' ')}
              style={{ background: article.category ? `linear-gradient(135deg, ${article.category.color}cc, ${article.category.color}66)` : 'linear-gradient(135deg,#064e3b,#0891b2)' }}
            >
              <span className="text-8xl mb-3 select-none">{article.category?.emoji ?? '✨'}</span>
              {article.category && <span className="text-white/70 text-sm font-bold uppercase tracking-widest">{article.category.name}</span>}
            </div>

            {/* Category badge overlay */}
            {article.category && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold text-white shadow-lg backdrop-blur-sm bg-black/30 border border-white/20">
                  <span>{article.category.emoji}</span>
                  <span>{article.category.name}</span>
                </span>
              </div>
            )}
          </motion.div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {allImages.map((img, i) => (
                <button
                  key={img} onClick={() => setActiveImg(i)}
                  className={['flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all duration-200',
                    i === activeImg ? 'border-emerald-500 ring-1 ring-emerald-400' : 'border-transparent opacity-55 hover:opacity-90',
                  ].join(' ')}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Article header ────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>

            {/* Sentiment pill */}
            <div className="flex items-center gap-2 mb-5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${sc.bg} ${sc.text} ${sc.border}`}>
                <span>{sc.emoji}</span><span>{sc.label}</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="article-headline text-4xl md:text-5xl font-black text-gray-950 leading-[1.1] text-balance mb-6">
              {article.title}
            </h1>

            {/* Byline */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 pb-6 border-b border-gray-200 mb-8">
              <span className="font-bold text-gray-800 uppercase tracking-wide text-xs">{article.source}</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                <time dateTime={publishedDate.toISOString()}>{format(publishedDate, 'MMMM d, yyyy')}</time>
                <span className="text-gray-400 text-xs">· {formatDistanceToNow(publishedDate, { addSuffix: true })}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {mins} min read
              </span>
              {article.analytics && (
                <span className="flex items-center gap-1.5">
                  <Eye size={13} />
                  {article.analytics.views.toLocaleString()} reads
                </span>
              )}
            </div>
          </motion.div>

          {/* ── Summary block ─────────────────────────────── */}
          {article.summary && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="space-y-5 mb-10">

              {/* TL;DR */}
              {tldr.length > 0 && (
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-base font-black text-emerald-800 uppercase tracking-widest">TL;DR</span>
                    <div className="flex-1 h-px bg-emerald-200" />
                  </div>
                  <ul className="space-y-2.5">
                    {tldr.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={17} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-emerald-900 text-sm font-medium leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pull quote */}
              <blockquote className="relative border-l-[5px] border-emerald-400 pl-6 py-2">
                <p className="text-gray-700 text-xl leading-relaxed italic font-light" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {article.summary.longSummary}
                </p>
              </blockquote>

              {/* Why This Matters */}
              <div className={`rounded-2xl border p-5 ${sc.bg} ${sc.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <span className={`font-black text-xs uppercase tracking-widest ${sc.text}`}>Why This Matters</span>
                </div>
                <p className={`font-semibold leading-relaxed ${sc.text}`}>{article.summary.keyTakeaway}</p>
              </div>
            </motion.div>
          )}

          {/* ── Article body ──────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }} className="mb-10">
            {article.cleanContent.length > 100 ? (
              <div className="article-body">
                {contentBlocks.map((block, i) =>
                  block.type === 'p' ? (
                    <p key={i}>{block.text}</p>
                  ) : (
                    <figure key={i} className="my-8 -mx-4 md:-mx-12">
                      <img
                        src={block.src} alt=""
                        className="w-full rounded-xl object-cover max-h-[480px] cursor-zoom-in shadow-md"
                        loading="lazy" decoding="async"
                        onClick={() => setLightbox(block.src)}
                        onError={(e) => { e.currentTarget.closest('figure')!.style.display = 'none' }}
                      />
                    </figure>
                  )
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                <p className="text-amber-800 font-medium mb-4">
                  Full article content is being fetched — read it at the source in the meantime.
                </p>
                <a
                  href={article.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  <ExternalLink size={15} />Read full article
                </a>
              </div>
            )}
          </motion.div>

          {/* ── Bottom actions ────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-gray-100 mb-14"
          >
            <div className="flex items-center gap-3">
              <ShareMenu article={article} />
              <a
                href={article.url} target="_blank" rel="noopener noreferrer"
                onClick={() => { trackEvent(article.id, 'click') }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ExternalLink size={14} />Read original
              </a>
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Source: {article.source}</span>
          </motion.div>
        </div>

        {/* ── Related articles ──────────────────────────── */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/60 py-12">
            <div className="max-w-5xl mx-auto px-4">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="article-headline text-2xl font-black text-gray-900">
                    {article.category?.emoji} More {article.category?.name ?? 'Good'} Stories
                  </h2>
                  {article.category && (
                    <Link to={`/category/${article.category.slug}`} className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold hover:underline flex items-center gap-1">
                      See all <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedArticles.map((related) => (
                    <NewsCard key={related.id} article={related} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}
