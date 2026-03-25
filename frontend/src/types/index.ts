export interface Category {
  id: string
  name: string
  slug: string
  color: string
  emoji: string
  articleCount: number
}

export interface Summary {
  shortSummary: string
  longSummary: string
  sentiment: 'POSITIVE' | 'UPLIFTING' | 'INSPIRING'
  keyTakeaway: string
}

export interface ArticleAnalytics {
  views: number
  shares: number
  likes: number
  clickThrough: number
}

export interface SocialShare {
  platform: 'TWITTER' | 'FACEBOOK' | 'LINKEDIN' | 'INSTAGRAM'
  shareUrl: string | null
  sharedAt: string
  engagement: number
}

export interface Article {
  id: string
  url: string
  title: string
  cleanContent: string
  source: string
  publishedAt: string
  imageUrl: string | null
  processedAt: string
  createdAt: string
  categoryId: string | null
  category: Category | null
  summary: Summary | null
  analytics: ArticleAnalytics | null
  shares?: SocialShare[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface Stats {
  totalArticles: number
  totalViews: number
  totalShares: number
  totalLikes: number
  topCategory: {
    name: string
    slug: string
    emoji: string
    articleCount: number
  } | null
}
