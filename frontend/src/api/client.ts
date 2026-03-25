import axios from 'axios'
import type { Article, Category, Stats, PaginatedResponse } from '../types'

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { error?: string })?.error ??
        error.message ??
        'An unexpected error occurred'
      return Promise.reject(new Error(message))
    }
    return Promise.reject(error)
  }
)

export interface GetArticlesParams {
  page?: number
  limit?: number
  category?: string
  search?: string
}

export async function getArticles(
  params: GetArticlesParams = {}
): Promise<PaginatedResponse<Article>> {
  const { data } = await apiClient.get<PaginatedResponse<Article>>('/articles', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      ...(params.category ? { category: params.category } : {}),
      ...(params.search ? { search: params.search } : {}),
    },
  })
  return data
}

export async function getArticle(id: string): Promise<Article> {
  const { data } = await apiClient.get<Article>(`/articles/${id}`)
  return data
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}

export async function getStats(): Promise<Stats> {
  const { data } = await apiClient.get<Stats>('/stats')
  return data
}

export async function trackEvent(
  articleId: string,
  event: 'view' | 'share' | 'like' | 'click',
  platform?: string
): Promise<void> {
  await apiClient.post('/track', { articleId, event, platform }).catch(() => {
    // Analytics failures should never interrupt UX
  })
}

export default apiClient
