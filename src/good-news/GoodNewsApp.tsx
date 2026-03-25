import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CategoryFilter } from './components/CategoryFilter';
import { NewsFeed } from './components/NewsFeed';
import { SearchBar } from './components/SearchBar';
import { StatsBar } from './components/StatsBar';
import styles from './GoodNewsApp.module.css';

const API_BASE = 'http://localhost:5001/api/goodnews';
const PAGE_SIZE = 24;

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  imageUrl?: string;
  publishedAt: string;
  fetchedAt: string;
}

interface Stats {
  total: number;
  lastFetch: string | null;
  sources: string[];
}

export default function GoodNewsApp() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNews = useCallback(async (cat: string, q: string, off: number, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(off),
        ...(cat !== 'all' ? { category: cat } : {}),
        ...(q ? { search: q } : {}),
      });
      const res = await fetch(`${API_BASE}?${params}`);
      if (!res.ok) throw new Error('Failed to load news');
      const data = await res.json();
      setItems(prev => append ? [...prev, ...data.items] : data.items);
      setTotal(data.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (res.ok) setStats(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    setOffset(0);
    fetchNews(category, search, 0);
  }, [category, search, fetchNews]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSearchChange = (q: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearch(q), 400);
  };

  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    fetchNews(category, search, newOffset, true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/refresh`, { method: 'POST' });
      const data = await res.json();
      if (data.inserted > 0) {
        await fetchNews(category, search, 0);
        await fetchStats();
      }
      alert(`Refresh complete — ${data.inserted} new stories added`);
    } catch {
      alert('Refresh failed. Check server connection.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>☀</span>
            <div>
              <h1 className={styles.brandTitle}>Good News Daily</h1>
              <p className={styles.brandTagline}>Science · Health · Awards · Discovery</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <SearchBar onChange={handleSearchChange} />
            <button
              className={styles.refreshBtn}
              onClick={handleRefresh}
              disabled={refreshing}
              title="Fetch latest stories"
            >
              {refreshing ? '⟳ Refreshing…' : '⟳ Refresh Feed'}
            </button>
          </div>
        </div>
      </header>

      {stats && <StatsBar stats={stats} />}

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <CategoryFilter selected={category} onChange={setCategory} />
        </aside>
        <main className={styles.main}>
          {error && <div className={styles.error}>{error} — <button onClick={() => fetchNews(category, search, 0)}>Retry</button></div>}
          <NewsFeed
            items={items}
            loading={loading}
            onLoadMore={handleLoadMore}
            hasMore={offset + PAGE_SIZE < total}
            total={total}
          />
        </main>
      </div>
    </div>
  );
}
