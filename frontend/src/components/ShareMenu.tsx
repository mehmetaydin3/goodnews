import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react'
import clsx from 'clsx'
import type { Article } from '../types'
import { trackEvent } from '../api/client'

interface ShareMenuProps {
  article: Article
  className?: string
}

export default function ShareMenu({ article, className }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const articleUrl = `${window.location.origin}/article/${article.id}`
  const shareText = article.summary?.shortSummary ?? article.title

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleShare = async (platform: string, url: string) => {
    await trackEvent(article.id, 'share', platform)

    if ('share' in navigator && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: article.title,
          text: shareText,
          url: articleUrl,
        })
        setIsOpen(false)
        return
      } catch {
        // Fall through to platform-specific sharing
      }
    }

    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
    setIsOpen(false)
  }

  const handleCopyLink = async () => {
    await trackEvent(article.id, 'share', 'copy')
    try {
      await navigator.clipboard.writeText(articleUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = articleUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const encodedUrl = encodeURIComponent(articleUrl)
  const encodedText = encodeURIComponent(`✨ ${shareText}`)

  const shareOptions = [
    {
      id: 'twitter',
      label: 'Share on X',
      icon: <Twitter size={16} />,
      color: '#000000',
      bg: 'hover:bg-gray-900 hover:text-white',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=GoodNews,Positive`,
    },
    {
      id: 'facebook',
      label: 'Share on Facebook',
      icon: <Facebook size={16} />,
      color: '#1877F2',
      bg: 'hover:bg-blue-600 hover:text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: 'linkedin',
      label: 'Share on LinkedIn',
      icon: <Linkedin size={16} />,
      color: '#0A66C2',
      bg: 'hover:bg-blue-700 hover:text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ]

  return (
    <div ref={menuRef} className={clsx('relative', className)}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={clsx(
          'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
          'bg-gray-100 text-gray-700 hover:bg-gray-200',
          isOpen && 'bg-gray-200'
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Share2 size={16} />
        Share
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
            role="menu"
          >
            <div className="p-1.5">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id, option.url)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 transition-all duration-150',
                    option.bg
                  )}
                  role="menuitem"
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}

              <div className="my-1 h-px bg-gray-100" />

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-150"
                role="menuitem"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-500" />
                    <span className="text-emerald-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 size={16} />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
