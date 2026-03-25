import { useQuery } from '@tanstack/react-query'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { Newspaper, Eye, Share2, TrendingUp } from 'lucide-react'
import { getStats } from '../api/client'
import type { Stats } from '../types'

interface AnimatedCounterProps {
  value: number
  duration?: number
}

function AnimatedCounter({ value, duration = 1.2 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (v) => Math.round(v).toLocaleString())
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, { duration })
      return controls.stop
    }
  }, [inView, value, duration, motionValue])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}

function StatItem({ icon, label, value, color }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-6 py-3"
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
        style={{ backgroundColor: color + '20', color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-lg font-bold text-gray-900 leading-none">
          <AnimatedCounter value={value} />
        </div>
        <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
      </div>
    </motion.div>
  )
}

export default function StatsBar() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: getStats,
    staleTime: 1000 * 60 * 5,
  })

  if (!stats) {
    return (
      <div className="bg-white border-b border-gray-100 py-1">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center h-16">
          <div className="animate-pulse flex gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="w-9 h-9 rounded-xl bg-gray-100" />
                <div>
                  <div className="h-4 w-16 bg-gray-100 rounded mb-1" />
                  <div className="h-3 w-12 bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center divide-x divide-gray-100 overflow-x-auto scrollbar-hide">
          <StatItem
            icon={<Newspaper size={18} />}
            label="Stories Published"
            value={stats.totalArticles}
            color="#10B981"
          />
          <StatItem
            icon={<Eye size={18} />}
            label="Total Reads"
            value={stats.totalViews}
            color="#60A5FA"
          />
          <StatItem
            icon={<Share2 size={18} />}
            label="Times Shared"
            value={stats.totalShares}
            color="#F472B6"
          />
          {stats.topCategory && (
            <div className="flex items-center gap-3 px-6 py-3 flex-shrink-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex-shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 leading-none">
                  {stats.topCategory.emoji} {stats.topCategory.name}
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  Top Category
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
