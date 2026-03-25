import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'mediaContent'], ['media:thumbnail', 'mediaThumbnail']],
  },
});

export type NewsCategory = 'science' | 'health' | 'environment' | 'awards' | 'technology' | 'space' | 'general';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: NewsCategory;
  imageUrl: string | null;
  publishedAt: string;
  fetchedAt: string;
}

interface FeedSource {
  url: string;
  source: string;
  category: NewsCategory;
}

const FEEDS: FeedSource[] = [
  // Space & NASA
  { url: 'https://www.nasa.gov/news-release/feed/', source: 'NASA', category: 'space' },
  // Science
  { url: 'https://www.sciencedaily.com/rss/top/science.xml', source: 'Science Daily', category: 'science' },
  { url: 'https://feeds.nature.com/nature/rss/current', source: 'Nature', category: 'science' },
  // Health / Medicine
  { url: 'https://www.nih.gov/news-events/news-releases.rss', source: 'NIH', category: 'health' },
  { url: 'https://www.who.int/feeds/entity/mediacentre/news/en/rss.xml', source: 'WHO', category: 'health' },
  // Environment
  { url: 'https://www.theguardian.com/environment/rss', source: 'The Guardian', category: 'environment' },
  // Technology
  { url: 'https://feeds.feedburner.com/TechCrunch/', source: 'TechCrunch', category: 'technology' },
  // Positive / Good News
  { url: 'https://www.goodnewsnetwork.org/feed/', source: 'Good News Network', category: 'general' },
  { url: 'https://positive.news/feed/', source: 'Positive News', category: 'general' },
];

// Keywords that indicate genuinely good/positive news
const POSITIVE_KEYWORDS = [
  'breakthrough', 'cure', 'discover', 'award', 'prize', 'win', 'achieve', 'success',
  'improve', 'advance', 'innovate', 'save', 'protect', 'restore', 'recover', 'heal',
  'milestone', 'record', 'first ever', 'first time', 'launch', 'mission', 'research',
  'study finds', 'scientists', 'researchers', 'nobel', 'pulitzer', 'champion',
  'eradicate', 'eliminate', 'reduce', 'lower', 'increase lifespan', 'new treatment',
  'vaccine', 'therapy', 'clean energy', 'renewable', 'species', 'conservation',
  'positive', 'good news', 'hope', 'community', 'volunteer', 'donate',
];

// Keywords to filter out negative/clickbait news
const NEGATIVE_KEYWORDS = [
  'war', 'kill', 'death', 'attack', 'terror', 'bomb', 'murder', 'crash', 'disaster',
  'scandal', 'fraud', 'corruption', 'abuse', 'violence', 'riot', 'protest', 'controversy',
  'crisis', 'collapse', 'fail', 'fire', 'flood', 'earthquake', 'hurricane', 'tornado',
];

function isPositiveNews(title: string, summary: string): boolean {
  const text = `${title} ${summary}`.toLowerCase();

  // Reject if contains negative keywords
  for (const kw of NEGATIVE_KEYWORDS) {
    if (text.includes(kw)) return false;
  }

  // Accept if contains positive keywords, or from known good-news sources
  for (const kw of POSITIVE_KEYWORDS) {
    if (text.includes(kw)) return true;
  }

  return false;
}

function extractImageUrl(item: any): string | undefined {
  if (item.mediaContent?.['$']?.url) return item.mediaContent['$'].url;
  if (item.mediaThumbnail?.['$']?.url) return item.mediaThumbnail['$'].url;
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) return item.enclosure.url;
  // Try to extract first image from content
  const content = item['content:encoded'] || item.content || item.summary || '';
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : undefined;
}

function generateId(url: string): string {
  // Simple hash from URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function cleanSummary(raw: string): string {
  if (!raw) return '';
  // Strip HTML tags
  return raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 400);
}

async function fetchFeed(feed: FeedSource): Promise<NewsItem[]> {
  try {
    const result = await parser.parseURL(feed.url);
    const items: NewsItem[] = [];

    for (const item of result.items.slice(0, 20)) {
      const title = item.title || '';
      const summary = cleanSummary(item.contentSnippet || item.summary || item.content || '');
      const url = item.link || '';

      if (!title || !url) continue;

      // For dedicated good news sources, skip keyword filtering
      const isDedicatedSource = ['Good News Network', 'Positive News', 'NASA', 'NIH'].includes(feed.source);
      if (!isDedicatedSource && !isPositiveNews(title, summary)) continue;

      items.push({
        id: generateId(url),
        title,
        summary,
        url,
        source: feed.source,
        category: feed.category,
        imageUrl: extractImageUrl(item) ?? null,
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
      });
    }

    return items;
  } catch (err) {
    console.error(`[newsFetcher] Failed to fetch ${feed.source}:`, (err as Error).message);
    return [];
  }
}

export async function fetchAllGoodNews(): Promise<NewsItem[]> {
  console.log('[newsFetcher] Starting fetch from', FEEDS.length, 'sources...');
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const allItems: NewsItem[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const item of result.value) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          allItems.push(item);
        }
      }
    }
  }

  // Sort by publishedAt descending
  allItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  console.log(`[newsFetcher] Fetched ${allItems.length} good news items`);
  return allItems;
}
