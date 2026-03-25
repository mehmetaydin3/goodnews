import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Sun, Loader2, RefreshCw, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import NewsCard from '../components/NewsCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import { getArticles, getCategories } from '../api/client'
import type { Article, Category, PaginatedResponse } from '../types'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  })

  const currentCategory = categories.find((c) => c.slug === slug)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery<PaginatedResponse<Article>, Error>({
    queryKey: ['articles', { category: slug, search }],
    queryFn: ({ pageParam }) =>
      getArticles({
        page: (pageParam as number) ?? 1,
        limit: 21,
        category: slug,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: !!slug,
  })

  const allArticles = data?.pages.flatMap((p) => p.data) ?? []
  const totalArticles = data?.pages[0]?.pagination.total ?? 0
  const featuredArticle = allArticles[0]
  const gridArticles = allArticles.slice(1)

  return (
    <div>
      <div
        className="text-white py-14"
        style={{
          background: currentCategory
            ? `linear-gradient(135deg, ${currentCategory.color}dd 0%, ${currentCategory.color}88 100%)`
            : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={15} />
            All Stories
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-5"
          >
            {currentCategory && (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {currentCategory.emoji}
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                {currentCategory?.name ?? slug}
              </h1>
              {totalArticles > 0 && (
                <p className="text-white/75 mt-1 text-sm font-medium">
                  {totalArticles.toLocaleString()} uplifting stories
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <SearchBar className="flex-1 max-w-md" />
          <div className="flex-1">
            <CategoryFilter activeSlug={slug} />
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="animate-spin text-brand-500" />
            <p className="text-gray-500 font-medium">Loading stories…</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">😕</div>
            <p className="text-gray-600 font-medium">Couldn't load stories</p>
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
                ? `No results for "${search}" in this category.`
                : 'No stories in this category yet — check back soon!'}
            </p>
            <Link
              to="/"
              className="text-brand-600 hover:underline text-sm font-medium"
            >
              Browse all stories →
            </Link>
          </div>
        )}

        {!isLoading && allArticles.length > 0 && (
          <div className="space-y-8">
            {featuredArticle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <NewsCard article={featuredArticle} variant="featured" />
              </motion.div>
            )}

            {/* Spotlight + side stack */}
            {gridArticles[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-5"
              >
                <div className="lg:col-span-3 min-h-[22rem]">
                  <NewsCard article={gridArticles[0]} variant="secondary" />
                </div>
                <div className="lg:col-span-2 grid grid-rows-2 gap-5">
                  {gridArticles.slice(1, 3).map((article, i) => (
                    <div key={article.id} className="min-h-[10rem]">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                        className="h-full"
                      >
                        <NewsCard article={article} variant="secondary" />
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {gridArticles.slice(3).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {gridArticles.slice(3).map((article, i) => (
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
            )}

            {hasNextPage && (
              <div className="flex justify-center pt-2 pb-6">
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
    </div>
  )
}
