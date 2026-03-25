import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Newspaper, Menu, X } from 'lucide-react'
import clsx from 'clsx'
import { getCategories, getStats } from '../api/client'
import type { Category, Stats } from '../types'

export default function Navbar() {
  const navigate = useNavigate()
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  })

  const { data: stats } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: getStats,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-navbar]')) {
        setIsCategoryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      data-navbar
      className={clsx(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'glassmorphism shadow-sm'
          : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-brand-600 transition-colors"
          >
            <span className="text-2xl">✨</span>
            <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">
              GoodNews
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <Newspaper size={15} />
              Home
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen((v) => !v)}
                className={clsx(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all',
                  isCategoryOpen && 'bg-gray-100'
                )}
                aria-expanded={isCategoryOpen}
                aria-haspopup="menu"
              >
                Categories
                <motion.span
                  animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} />
                </motion.span>
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    role="menu"
                  >
                    <div className="p-2 grid grid-cols-2 gap-1">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            navigate(`/category/${cat.slug}`)
                            setIsCategoryOpen(false)
                          }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                          role="menuitem"
                        >
                          <span
                            className="flex items-center justify-center w-7 h-7 rounded-lg text-base flex-shrink-0"
                            style={{ backgroundColor: cat.color + '20' }}
                          >
                            {cat.emoji}
                          </span>
                          <span className="truncate font-medium text-xs">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {stats && (
              <div className="flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
                {stats.totalArticles.toLocaleString()} stories
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100 py-3 overflow-hidden"
            >
              <Link
                to="/"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Newspaper size={16} />
                Home
              </Link>

              <div className="mt-1">
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Categories
                </div>
                <div className="grid grid-cols-2 gap-1 px-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <span>{cat.emoji}</span>
                      <span className="text-xs truncate">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
