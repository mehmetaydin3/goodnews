import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid } from 'lucide-react'
import clsx from 'clsx'
import { getCategories } from '../api/client'
import type { Category } from '../types'

interface CategoryFilterProps {
  activeSlug?: string
}

export default function CategoryFilter({ activeSlug }: CategoryFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const current = activeSlug ?? searchParams.get('category') ?? ''

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  })

  const handleSelect = (slug: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (slug === '') {
        next.delete('category')
      } else {
        next.set('category', slug)
      }
      next.delete('page')
      return next
    })
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => handleSelect('')}
          className={clsx(
            'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
            current === ''
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          )}
          aria-pressed={current === ''}
        >
          <LayoutGrid size={14} />
          All Stories
        </button>

        {categories.map((cat) => {
          const isActive = current === cat.slug
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.slug)}
              className={clsx(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 border',
                isActive
                  ? 'text-white shadow-md border-transparent'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:shadow-sm border-gray-200'
              )}
              style={
                isActive
                  ? { backgroundColor: cat.color, borderColor: cat.color }
                  : {}
              }
              aria-pressed={isActive}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
              {cat.articleCount > 0 && (
                <span
                  className={clsx(
                    'inline-flex items-center justify-center rounded-full text-xs px-1.5 py-0.5 min-w-[20px]',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {cat.articleCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent" />
    </div>
  )
}
