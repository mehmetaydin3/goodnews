import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import clsx from 'clsx'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export default function SearchBar({
  placeholder = 'Search positive stories…',
  className,
}: SearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') ?? '')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? ''
    if (currentSearch !== value) {
      setValue(currentSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const commitSearch = (newValue: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (newValue.trim() === '') {
        next.delete('search')
      } else {
        next.set('search', newValue.trim())
      }
      next.delete('page')
      return next
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      commitSearch(newValue)
    }, 300)
  }

  const handleClear = () => {
    setValue('')
    commitSearch('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      commitSearch(value)
    }
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <motion.div
      animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={clsx('relative', className)}
    >
      <div
        className={clsx(
          'flex items-center gap-2 bg-white rounded-xl border transition-all duration-200 px-4 py-2.5',
          isFocused
            ? 'border-brand-400 ring-2 ring-brand-100 shadow-md'
            : 'border-gray-200 shadow-sm hover:border-gray-300'
        )}
      >
        <Search
          size={18}
          className={clsx(
            'flex-shrink-0 transition-colors duration-200',
            isFocused ? 'text-brand-500' : 'text-gray-400'
          )}
        />

        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm min-w-0"
          aria-label="Search articles"
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              className="flex-shrink-0 p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
