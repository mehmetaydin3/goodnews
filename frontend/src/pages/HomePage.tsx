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

const HERO_WORDS = ['Real stories.', 'Real joy.']

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
  const featuredArticle = allArticles[0]
  const gridArticles = allArticles.slice(1)

  return (
    <>
      <section className="gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
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
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse-soft" />
              Updated every 30 minutes
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-4">
              {HERO_WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className={i === 1 ? 'text-emerald-300 block' : 'block'}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg md:text-xl text-white/80 max-w-xl mx-auto"
            >
              Curated positive, uplifting, and inspiring stories from around the
              world — powered by AI.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <StatsBar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <SearchBar className="flex-1 max-w-md" />
          <div className="flex-1">
            <CategoryFilter />
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="animate-spin text-brand-500" />
            <p className="text-gray-500 font-medium">Loading positive stories…</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">😕</div>
            <p className="text-gray-600 font-medium">
              Couldn't load stories right now
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors font-medium text-sm"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && allArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-6xl">☀️</div>
            <h2 className="text-xl font-semibold text-gray-700">
              No stories found
            </h2>
            <p className="text-gray-500 text-sm text-center max-w-xs">
              {search
                ? `No results for "${search}". Try a different search.`
                : 'No stories in this category yet. Check back soon!'}
            </p>
          </div>
        )}

        {!isLoading && allArticles.length > 0 && (
          <>
            {featuredArticle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                    ✨ Featured Story
                  </span>
                </div>
                <NewsCard article={featuredArticle} variant="featured" />
              </motion.div>
            )}

            {gridArticles.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    More Stories
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {gridArticles.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
                    >
                      <NewsCard article={article} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {hasNextPage && (
              <div className="flex justify-center mt-10">
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
          </>
        )}
      </div>
    </>
  )
}
