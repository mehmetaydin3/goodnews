import { useState, useMemo } from 'react';
import { NavBar } from '../../features/NavBar/NavBar';
import { SearchFilterBar } from '../../features/SearchFilterBar/SearchFilterBar';
import { MusicianGrid } from '../../features/MusicianGrid/MusicianGrid';
import { Footer } from '../../features/Footer/Footer';
import { BookingDrawer } from '../../features/BookingDrawer/BookingDrawer';
import { Typography } from '../../ui/Typography/Typography';
import styles from './ListingPageFull.module.css';

function applyFilters(musicians, filters) {
  return musicians.filter((m) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match = m.name.toLowerCase().includes(q) ||
        m.tagline?.toLowerCase().includes(q) ||
        m.genres?.some((g) => g.toLowerCase().includes(q)) ||
        m.skills?.some((s) => s.toLowerCase().includes(q)) ||
        m.location?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.serviceType && filters.serviceType !== 'all') {
      if (!m.services?.[filters.serviceType]) return false;
    }
    if (filters.genre && filters.genre !== 'All Genres') {
      if (!m.genres?.includes(filters.genre)) return false;
    }
    if (filters.onlineOnly && !m.online) return false;
    return true;
  });
}

function sortMusicians(musicians, sortBy) {
  const arr = [...musicians];
  if (sortBy === 'rating') arr.sort((a, b) => b.rating - a.rating);
  if (sortBy === 'price_asc') arr.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
  if (sortBy === 'price_desc') arr.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
  if (sortBy === 'reviews') arr.sort((a, b) => b.reviewCount - a.reviewCount);
  return arr;
}

export function ListingPageFull({
  musicians = [],
  pageTitle = 'Find Your Musician',
  pageSubtitle = 'Browse verified professionals for remote sessions, events, weddings, and lessons.',
  isDark = false,
  onThemeToggle,
  className = '',
  ...props
}) {
  const [filters, setFilters] = useState({ search: '', serviceType: 'all', genre: 'All Genres', onlineOnly: false, sortBy: 'featured' });

  const handleBook = (musician) => {
    window.location.href = `/musician/${musician.id}`;
  };

  const results = useMemo(() => {
    const filtered = applyFilters(musicians, filters);
    return sortMusicians(filtered, filters.sortBy);
  }, [musicians, filters]);

  return (
    <div className={[styles.page, className].filter(Boolean).join(' ')} {...props}>
      <NavBar isDark={isDark} onThemeToggle={onThemeToggle} />

      <div className={styles.pageHeader}>
        <Typography as="h1" variant="display" className={styles.pageTitle}>{pageTitle}</Typography>
        <Typography variant="body" className={styles.pageSubtitle}>{pageSubtitle}</Typography>
      </div>

      <SearchFilterBar
        onFilterChange={setFilters}
        resultCount={results.length}
      />

      <main className={styles.main}>
        <MusicianGrid
          musicians={results}
          onBook={handleBook}
          onContact={(m) => console.log('Contact', m.name)}
        />
      </main>

      <Footer />
    </div>
  );
}

export default ListingPageFull;
