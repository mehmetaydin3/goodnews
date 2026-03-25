export interface RawArticleJob {
  url: string;
  title: string;
  content: string;
  source: string;
  publishedAt?: string;
  imageUrl?: string;
}

export interface ArticleJob {
  articleId: string;
}

export interface ClassifyJob {
  articleId: string;
  title: string;
  content: string;
}

export interface SummarizeJob {
  articleId: string;
  title: string;
  content: string;
}

export interface ReshareJob {
  articleId: string;
  summary: string;
  title: string;
  categories: string[];
  articleUrl: string;
}

export type AnalyticsEventType = 'view' | 'share' | 'like' | 'click';

export interface AnalyticsEvent {
  articleId: string;
  event: AnalyticsEventType;
  platform?: string;
}

export interface ClaudeClassifyResponse {
  category: string;
  sentiment: 'POSITIVE' | 'UPLIFTING' | 'INSPIRING';
  confidence: number;
}

export interface ClaudeSummarizeResponse {
  shortSummary: string;
  longSummary: string;
  keyTakeaway: string;
  sentiment: 'POSITIVE' | 'UPLIFTING' | 'INSPIRING';
}

export const CATEGORIES = [
  { name: 'Science & Nature', slug: 'science-nature', color: '#60A5FA', emoji: '🔬' },
  { name: 'Health & Medicine', slug: 'health-medicine', color: '#34D399', emoji: '💊' },
  { name: 'Community & Society', slug: 'community-society', color: '#F472B6', emoji: '🤝' },
  { name: 'Innovation & Tech', slug: 'innovation-tech', color: '#A78BFA', emoji: '💡' },
  { name: 'Environment', slug: 'environment', color: '#4ADE80', emoji: '🌿' },
  { name: 'Sports & Achievement', slug: 'sports-achievement', color: '#FB923C', emoji: '🏆' },
  { name: 'Arts & Culture', slug: 'arts-culture', color: '#F59E0B', emoji: '🎨' },
  { name: 'Business & Economy', slug: 'business-economy', color: '#06B6D4', emoji: '📈' },
  { name: 'Education', slug: 'education', color: '#8B5CF6', emoji: '📚' },
  { name: 'World Affairs', slug: 'world-affairs', color: '#EC4899', emoji: '🌍' },
] as const;

export type CategoryName = typeof CATEGORIES[number]['name'];
