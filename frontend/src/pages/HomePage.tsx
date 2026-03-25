import { useSearchParams } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Sun, Loader2, RefreshCw } from 'lucide-react'
import NewsCard from '../components/NewsCard'
import CategoryFilter from '../components/CategoryFilter'
import SearchBar from '../components/SearchBar'
import StatsBar from '../components/StatsBar'
import { getArticles } from '../api/client'
import type { Article, PaginatedResponse } from '../types'

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const search = searchParams.get('search') ?? ''

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery<PaginatedResponse<Article>, Error>({
    queryKey: ['articles', { category, search }],
    queryFn: ({ pageParam }) =>
      getArticles({
        page: (pageParam as number) ?? 1,
        limit: 21,
        category: category || undefined,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
  })

  const allArticles = data?.pages.flatMap((p) => p.data) ?? []

  // Editorial layout slices
  const hero = allArticles[0]           // full-width hero
  const spotlight = allArticles[1]      // big left card in second row
  const sideStack = allArticles.slice(2, 4)  // 2 stacked right cards
  const gridArticles = allArticles.slice(4)  // 3-col grid below

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse-soft" />
              Updated every 30 minutes
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="block"
              >
                Real stories.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="block text-emerald-300"
              >
                Real joy.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg md:text-xl text-white/80 max-w-xl mx-auto"
            >
              Curated positive, uplifting, and inspiring stories from around the world — powered by AI.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <StatsBar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <SearchBar className="flex-1 max-w-md" />
          <div className="flex-1">
            <CategoryFilter />
          </div>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="animate-spin text-brand-500" />
            <p className="text-gray-500 font-medium">Loading positive stories…</p>
          </div>
        )}

        {/* ── Error ── */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">😕</div>
            <p className="text-gray-600 font-medium">Couldn't load stories right now</p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors font-medium text-sm"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* ── Empty ── */}
        {!isLoading && !isError && allArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-6xl">☀️</div>
            <h2 className="text-xl font-semibold text-gray-700">No stories found</h2>
            <p className="text-gray-500 text-sm text-center max-w-xs">
              {search
                ? `No results for "${search}". Try a different search.`
                : 'No stories in this category yet. Check back soon!'}
            </p>
          </div>
        )}

        {/* ── Editorial Layout ── */}
        {!isLoading && allArticles.length > 0 && (
          <div className="space-y-8">

            {/* Row 1: Full-width hero */}
            {hero && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <NewsCard article={hero} variant="featured" />
              </motion.div>
            )}

            {/* Row 2: Big spotlight (left 60%) + stacked side cards (right 40%) */}
            {spotlight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-5"
              >
                {/* Left — tall spotlight card */}
                <div className="lg:col-span-3 min-h-[22rem]">
                  <NewsCard article={spotlight} variant="secondary" />
                </div>

                {/* Right — 2 stacked cards */}
                <div className="lg:col-span-2 grid grid-rows-2 gap-5">
                  {sideStack.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                      className="min-h-[10rem]"
                    >
                      <NewsCard article={article} variant="secondary" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Row 3+: 3-column magazine grid */}
            {gridArticles.length > 0 && (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    More Stories
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {gridArticles.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.35) }}
                    >
                      <NewsCard article={article} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Load More */}
            {hasNextPage && (
              <div className="flex justify-center pt-4 pb-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Loading more…
                    </>
                  ) : (
                    <>
                      <Sun size={16} />
                      Load more stories
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
