import Parser from 'rss-parser';
import axios from 'axios';
import cron from 'node-cron';
import { extract } from '@extractus/article-extractor';
import * as cheerio from 'cheerio';
import { prisma, deduperQueue } from '@goodnews/shared';

// ─── RSS Parser ───────────────────────────────────────────────────────────────
const rssParser = new Parser({
  timeout: 12000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; GoodNewsBot/1.0)',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['media:group', 'mediaGroup', { keepArray: false }],
    ],
  },
});

// ─── Curated feeds — open-access only, no paywalls ───────────────────────────
const CURATED_FEEDS = [
  // Science & Discovery
  'https://www.positive.news/feed/',
  'https://www.futurity.org/feed/',
  'https://www.sciencedaily.com/rss/all.xml',
  'https://newatlas.com/index.rss',
  'https://www.theguardian.com/environment/rss',
  'https://www.theguardian.com/science/rss',
  'https://theconversation.com/us/articles.atom',   // Open-access academic journalism
  'https://earthsky.org/feed/',                     // Space & Earth science
  'https://bigthink.com/feed/',                     // Ideas & science
  'https://singularityhub.com/feed/',               // Emerging tech
  'https://www.earth.com/feed/',                    // Environmental science
  // Health & Medicine
  'https://medicalxpress.com/rss-feed/breaking/',   // Medical Xpress breaking news
  // Innovation
  'https://arstechnica.com/science/feed/',          // Deep science reporting
  'https://www.popsci.com/rss.xml',                 // Popular Science
  'https://www.iflscience.com/rss/',                // IFL Science
];

// ─── Domains that block scrapers or are behind paywalls ───────────────────────
const BLOCKED_DOMAINS = new Set([
  'nytimes.com', 'washingtonpost.com', 'wsj.com', 'ft.com',
  'bloomberg.com', 'theatlantic.com', 'wired.com', 'newyorker.com',
  'smithsonianmag.com', 'nationalgeographic.com', 'scientificamerican.com',
  'npr.org', 'bbc.co.uk', 'economist.com',
]);

// ─── Negative keyword blocker ─────────────────────────────────────────────────
const NEGATIVE_TITLE_WORDS = new Set([
  // Violence & crime
  'killed','kills','kill','murder','murdered','dead','death','deaths','died',
  'die','dies','crash','crashes','crashed','bomb','bombing','explosion',
  'exploded','war','wars','attack','attacked','attacks','shooting','shootings',
  'shot','genocide','massacre','terror','terrorism','terrorist','hostage',
  'kidnap','kidnapped','assault','violence','violent','rape','abuse',
  // Disaster
  'disaster','tragedy','tragic','wildfire','hurricane','earthquake','tsunami',
  'flood','floods','collapse','collapsed','evacuate','evacuated','deadly',
  'fatal','danger','dangerous','emergency','outbreak',
  // Legal / political drama
  'arrested','convicted','sentenced','sentence','prison','fraud','scandal',
  'corruption','lawsuit','indicted','charged','impeach',
  // Economic distress
  'bankrupt','bankruptcy','recession','layoff','layoffs','crisis',
  // Celebrity / gossip
  'celebrity','celebrities','kardashian','jenner','bieber','beyoncé','beyonce',
  'kanye','drake','rihanna','taylor swift','gossip','dating','breakup',
  'divorce','cheating','feud','beef','shades','claps back','fires back',
  'slams','calls out','claps','leaked','nudes','affair','scandal',
]);

function isPositiveTitle(title: string): boolean {
  const words = title.toLowerCase().match(/\b\w+\b/g) ?? [];
  return !words.some((w) => NEGATIVE_TITLE_WORDS.has(w));
}

// ─── Concurrency semaphore ────────────────────────────────────────────────────
class Semaphore {
  private queue: Array<() => void> = [];
  constructor(private max: number, private running = 0) {}
  acquire(): Promise<void> {
    if (this.running < this.max) { this.running++; return Promise.resolve(); }
    return new Promise((resolve) => this.queue.push(resolve));
  }
  release(): void {
    this.running--;
    const next = this.queue.shift();
    if (next) { this.running++; next(); }
  }
}
const scraper = new Semaphore(8); // 8 concurrent article scrapes

// ─── Extract all images from HTML ────────────────────────────────────────────
function bestFromSrcset(srcset: string): string | null {
  // Pick the highest-resolution candidate from a srcset string
  const candidates = srcset.split(',').map((s) => {
    const parts = s.trim().split(/\s+/);
    const url = parts[0];
    const w = parts[1] ? parseInt(parts[1]) : 0;
    return { url, w };
  }).filter((c) => /^https?:/.test(c.url));
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.w - a.w);
  return candidates[0].url;
}

function extractImagesFromHtml(html: string, _baseUrl: string): string[] {
  const found: string[] = [];

  // <img src> and lazy-load variants (data-src, data-lazy-src, data-original)
  const imgRegex = /<img[^>]+>/gi;
  let m: RegExpExecArray | null;
  while ((m = imgRegex.exec(html)) !== null) {
    const tag = m[0];
    for (const attr of ['src', 'data-src', 'data-lazy-src', 'data-original', 'data-full-src']) {
      const attrMatch = new RegExp(`${attr}=["']([^"']+)["']`, 'i').exec(tag);
      if (attrMatch) {
        const u = attrMatch[1];
        if (/^https?:/.test(u)) { found.push(u); break; }
        if (u.startsWith('//')) { found.push('https:' + u); break; }
      }
    }
    // Also pull best candidate from srcset on <img>
    const srcsetMatch = /srcset=["']([^"']+)["']/i.exec(tag);
    if (srcsetMatch) {
      const best = bestFromSrcset(srcsetMatch[1]);
      if (best) found.push(best);
    }
  }

  // <source srcset> inside <picture> elements
  const sourceRegex = /<source[^>]+srcset=["']([^"']+)["'][^>]*>/gi;
  while ((m = sourceRegex.exec(html)) !== null) {
    const best = bestFromSrcset(m[1]);
    if (best) found.push(best);
  }

  // og:image / twitter:image meta tags in page head
  const metaRegex = /<meta[^>]+(?:property=["']og:image["']|name=["']twitter:image["'])[^>]+content=["']([^"']+)["']/gi;
  while ((m = metaRegex.exec(html)) !== null) {
    if (/^https?:/.test(m[1])) found.push(m[1]);
  }
  // alternate meta order
  const metaRegex2 = /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property=["']og:image["']|name=["']twitter:image["'])/gi;
  while ((m = metaRegex2.exec(html)) !== null) {
    if (/^https?:/.test(m[1])) found.push(m[1]);
  }

  const NOISE = ['tracking','pixel','analytics','logo','icon','avatar','1x1','badge',
    'spinner','loader','placeholder','blank','transparent','spacer','separator'];

  return [...new Set(found)].filter((url) => {
    const lower = url.toLowerCase();
    return !NOISE.some((n) => lower.includes(n));
  });
}

// ─── Full article scraper ─────────────────────────────────────────────────────
interface ScrapedArticle {
  content: string;
  imageUrl: string | undefined;
  images: string[];
}

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

function htmlToText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, ' ').trim();
}

// Stage 2: cheerio-based fallback for when article-extractor gets too little
async function scrapeWithCheerio(url: string): Promise<ScrapedArticle> {
  const resp = await axios.get<string>(url, { headers: FETCH_HEADERS, timeout: 15000, responseType: 'text' });
  const $ = cheerio.load(resp.data as string);

  // Remove noise elements
  $('script,style,nav,header,footer,aside,[class*="sidebar"],[class*="menu"],[class*="ad-"],[id*="sidebar"],[id*="cookie"],[class*="related"],[class*="newsletter"],[class*="subscribe"]').remove();

  // Try semantic article containers first
  const selectors = [
    'article',
    '[class*="article-body"]', '[class*="article__body"]',
    '[class*="story-body"]', '[class*="post-content"]',
    '[class*="entry-content"]', '[class*="content-body"]',
    '[itemprop="articleBody"]', '.prose', 'main',
  ];

  let contentHtml = '';
  for (const sel of selectors) {
    const el = $(sel).first();
    if (el.length && el.text().trim().length > 400) {
      contentHtml = el.html() ?? '';
      break;
    }
  }

  // Last resort: body minus nav/header/footer
  if (!contentHtml) contentHtml = $('body').html() ?? '';

  const content = htmlToText(contentHtml);

  // og:image
  const ogImage = $('meta[property="og:image"]').attr('content') ??
    $('meta[name="twitter:image"]').attr('content');
  const imageUrl = ogImage && /^https?:/.test(ogImage) ? ogImage : undefined;
  const images = extractImagesFromHtml(contentHtml, url);

  return { content, imageUrl, images };
}

async function scrapeFullArticle(url: string): Promise<ScrapedArticle> {
  // Skip known paywall domains immediately
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    if (BLOCKED_DOMAINS.has(hostname)) return { content: '', imageUrl: undefined, images: [] };
  } catch {
    return { content: '', imageUrl: undefined, images: [] };
  }

  await scraper.acquire();
  try {
    // Stage 1: article-extractor (fast, handles most open-access sites)
    let result: ScrapedArticle = { content: '', imageUrl: undefined, images: [] };
    try {
      const extracted = await extract(url, undefined, { headers: FETCH_HEADERS });
      if (extracted) {
        const html = extracted.content ?? '';
        const content = htmlToText(html);
        const images = extractImagesFromHtml(html, url);
        result = {
          content,
          imageUrl: extracted.image ?? images[0] ?? undefined,
          images,
        };
      }
    } catch { /* fall through to stage 2 */ }

    // Stage 2: cheerio fallback if stage 1 gave less than 800 chars
    if (result.content.length < 800) {
      try {
        const cheerioResult = await scrapeWithCheerio(url);
        if (cheerioResult.content.length > result.content.length) {
          result = cheerioResult;
        }
      } catch { /* give up */ }
    }

    return result;
  } finally {
    scraper.release();
  }
}

// ─── RSS image extractor (fast, no HTTP) ─────────────────────────────────────
function extractRssImage(item: Record<string, unknown>): string | undefined {
  const enc = item.enclosure as { url?: string; type?: string } | undefined;
  if (enc?.url && /^https?:/.test(enc.url)) return enc.url;

  const mc = item.mediaContent as { $?: { url?: string }; url?: string } | string | undefined;
  if (typeof mc === 'string' && /^https?:/.test(mc)) return mc;
  if (mc && typeof mc === 'object') {
    const u = (mc as { $?: { url?: string }; url?: string }).$?.url ?? (mc as { url?: string }).url;
    if (u && /^https?:/.test(u)) return u;
  }

  const mt = item.mediaThumbnail as { $?: { url?: string }; url?: string } | string | undefined;
  if (typeof mt === 'string' && /^https?:/.test(mt)) return mt;
  if (mt && typeof mt === 'object') {
    const u = (mt as { $?: { url?: string }; url?: string }).$?.url ?? (mt as { url?: string }).url;
    if (u && /^https?:/.test(u)) return u;
  }

  const mg = item.mediaGroup as { mediaContent?: { $?: { url?: string } } } | undefined;
  if (mg?.mediaContent?.$?.url) return mg.mediaContent.$.url;

  return undefined;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface FetchedArticle {
  url: string;
  title: string;
  content: string;
  source: string;
  publishedAt?: string;
  imageUrl?: string;
  images: string[];
}

// ─── RSS feed fetcher ─────────────────────────────────────────────────────────
async function fetchRssFeed(feedUrl: string): Promise<FetchedArticle[]> {
  try {
    const feed = await rssParser.parseURL(feedUrl);
    const sourceName = feed.title || new URL(feedUrl).hostname;

    const items = (feed.items ?? []).filter(
      (item) => item.link && item.title && item.link.startsWith('http')
    );

    const results = await Promise.all(
      items.map(async (item): Promise<FetchedArticle | null> => {
        const title = stripHtml(item.title ?? '');
        if (!isPositiveTitle(title)) return null;

        // Skip known paywall domains
        try {
          const hostname = new URL(item.link!).hostname.replace('www.', '');
          if (BLOCKED_DOMAINS.has(hostname)) return null;
        } catch { return null; }

        // Quick RSS image (no HTTP needed)
        const rssImage = extractRssImage(item as unknown as Record<string, unknown>);

        // Full article scrape — article-extractor + cheerio fallback
        const scraped = await scrapeFullArticle(item.link!);

        // Require at least 800 chars of real content
        if (scraped.content.length < 800) return null;

        const imageUrl = scraped.imageUrl ?? rssImage;
        const images = scraped.images.length > 0
          ? scraped.images
          : rssImage ? [rssImage] : [];

        return {
          url: item.link!,
          title,
          content: scraped.content,
          source: sourceName,
          publishedAt: item.pubDate ?? item.isoDate,
          imageUrl,
          images,
        };
      })
    );

    const filtered = results.filter((r): r is FetchedArticle => r !== null);
    console.log(
      `[Fetcher] ${new URL(feedUrl).hostname}: ${filtered.length}/${items.length} articles`
    );
    return filtered;
  } catch (err: unknown) {
    console.error(`[Fetcher] Feed error ${new URL(feedUrl).hostname}: ${err instanceof Error ? err.message : err}`);
    return [];
  }
}

// ─── NewsAPI fetcher ──────────────────────────────────────────────────────────
interface NewsApiArticle {
  url: string; title: string; description: string | null;
  content: string | null; source: { name: string };
  publishedAt: string; urlToImage: string | null;
}

async function fetchFromNewsApi(): Promise<FetchedArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  const queries = [
    'scientific breakthrough discovery',
    'renewable energy innovation record',
    'community charity rescued volunteers',
    'wildlife conservation species restored',
    'medical treatment cure advance',
  ];

  const allArticles: FetchedArticle[] = [];
  for (const q of queries) {
    try {
      const resp = await axios.get<{ articles: NewsApiArticle[] }>(
        'https://newsapi.org/v2/everything',
        { params: { q, sortBy: 'publishedAt', pageSize: 10, language: 'en', apiKey }, timeout: 10000 }
      );
      const articles = (resp.data?.articles ?? []).filter((a) => {
        if (!a.url || !a.title || a.title === '[Removed]') return false;
        if (!isPositiveTitle(a.title)) return false;
        try {
          const hostname = new URL(a.url).hostname.replace('www.', '');
          if (BLOCKED_DOMAINS.has(hostname)) return false;
        } catch { return false; }
        return true;
      });
      const scraped = await Promise.all(
        articles.map(async (a): Promise<FetchedArticle | null> => {
          const full = await scrapeFullArticle(a.url);
          if (full.content.length < 800) return null;
          const imageUrl = full.imageUrl ?? a.urlToImage ?? undefined;
          const images = full.images.length > 0
            ? full.images
            : a.urlToImage ? [a.urlToImage] : [];
          return {
            url: a.url, title: stripHtml(a.title),
            content: full.content, source: a.source.name,
            publishedAt: a.publishedAt, imageUrl, images,
          };
        })
      );
      allArticles.push(...scraped.filter((r): r is FetchedArticle => r !== null));
    } catch (err: unknown) {
      console.error(`[Fetcher] NewsAPI "${q}": ${err instanceof Error ? err.message : err}`);
    }
  }
  return allArticles;
}

// ─── Backfill content for articles with short cleanContent ───────────────────
async function backfillContent(): Promise<void> {
  const articles = await prisma.article.findMany({
    where: { cleanContent: { not: { startsWith: ' '.repeat(500) } } },
    select: { id: true, url: true, cleanContent: true },
    take: 20,
  });

  // Filter in JS since Prisma doesn't support LENGTH() filter directly
  const short = articles.filter((a) => a.cleanContent.length < 500);
  if (short.length === 0) return;

  console.log(`[Fetcher] Backfilling content for ${short.length} articles…`);
  let updated = 0;
  await Promise.all(
    short.map(async (a) => {
      const scraped = await scrapeFullArticle(a.url);
      if (scraped.content.length > a.cleanContent.length + 200) {
        await prisma.article.update({
          where: { id: a.id },
          data: {
            cleanContent: scraped.content.slice(0, 100000),
            ...(scraped.imageUrl ? { imageUrl: scraped.imageUrl } : {}),
            ...(scraped.images.length > 0 ? { images: scraped.images } : {}),
          },
        });
        updated++;
      }
    })
  );
  console.log(`[Fetcher] Content backfill: ${updated}/${short.length} updated`);
}

// ─── Backfill images for articles with empty images array ────────────────────
async function backfillImages(): Promise<void> {
  const articles = await prisma.article.findMany({
    where: { images: { isEmpty: true } },
    select: { id: true, url: true, imageUrl: true },
    take: 30,
  });
  if (articles.length === 0) return;

  console.log(`[Fetcher] Backfilling images for ${articles.length} articles…`);
  let updated = 0;
  await Promise.all(
    articles.map(async (a) => {
      const scraped = await scrapeFullArticle(a.url);
      if (scraped.images.length > 0 || scraped.imageUrl) {
        await prisma.article.update({
          where: { id: a.id },
          data: {
            imageUrl: a.imageUrl ?? scraped.imageUrl ?? null,
            images: scraped.images,
          },
        });
        updated++;
      }
    })
  );
  console.log(`[Fetcher] Backfill: ${updated}/${articles.length} updated`);
}

// ─── Main run ─────────────────────────────────────────────────────────────────
async function runFetch(): Promise<void> {
  console.log(`\n[Fetcher] ─── Run started ${new Date().toISOString()} ───`);

  const feeds = process.env.RSS_FEEDS
    ? process.env.RSS_FEEDS.split(',').map((f) => f.trim()).filter(Boolean)
    : CURATED_FEEDS;

  const feedResults = await Promise.allSettled(feeds.map(fetchRssFeed));
  const allArticles: FetchedArticle[] = [];
  for (const r of feedResults) {
    if (r.status === 'fulfilled') allArticles.push(...r.value);
  }

  const newsApiArticles = await fetchFromNewsApi();
  allArticles.push(...newsApiArticles);

  // Dedupe by URL within batch
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  console.log(`[Fetcher] ${unique.length} unique articles after filter`);

  let newCount = 0;
  for (const article of unique) {
    if (!article.url || !article.title) continue;
    try {
      const existing = await prisma.rawArticle.findUnique({ where: { url: article.url } });
      if (existing) continue;

      const raw = await prisma.rawArticle.create({
        data: {
          url: article.url,
          title: article.title.slice(0, 500),
          content: article.content.slice(0, 100000),
          source: article.source.slice(0, 200),
          imageUrl: article.imageUrl ?? null,
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
        },
      });

      await deduperQueue.add(
        'dedup',
        { rawArticleId: raw.id, images: article.images },
        { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: 100, removeOnFail: 50 }
      );
      newCount++;
    } catch (err: unknown) {
      console.error(`[Fetcher] Store error: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`[Fetcher] ─── ${newCount} new articles queued ───`);
  backfillContent().catch((e) => console.error('[Fetcher] Content backfill error:', e.message));
  backfillImages().catch((e) => console.error('[Fetcher] Image backfill error:', e.message));
}

async function start() {
  console.log('[Fetcher] Agent starting…');
  await runFetch();
  cron.schedule('*/30 * * * *', runFetch);
  console.log('[Fetcher] Scheduled every 30 minutes');
}

start().catch((err) => { console.error('[Fetcher] Fatal:', err); process.exit(1); });
