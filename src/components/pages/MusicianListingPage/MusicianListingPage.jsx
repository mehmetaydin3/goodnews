import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MusicianGrid } from '../../features/MusicianGrid/MusicianGrid';
import { Button } from '../../ui/Button/Button';
import { NavBar } from '../../features/NavBar/NavBar';
import { Footer } from '../../features/Footer/Footer';
import { musiciansData } from '../../../mocks/musicians';
import styles from './MusicianListingPage.module.css';

const API_BASE = 'http://localhost:5001';

const GENRES = ['All Genres', 'Hip-Hop', 'Pop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Afrobeats', 'Flamenco', 'World Music', 'Ambient', 'Rock', 'Soul', 'Gospel', 'Blues', 'Latin', 'Indian Classical', 'Fusion', 'Cinematic', 'Experimental'];
const INSTRUMENTS = ['All Instruments', 'Guitar', 'Piano', 'Violin', 'Viola', 'Cello', 'Drums', 'Percussion', 'Vocals', 'Synthesizer', 'Bass', 'Saxophone', 'Trumpet', 'Mixing', 'Mastering', 'Sound Design', 'Ableton Live', 'Beat Making', 'Film Scoring'];
const SERVICE_TYPES = [
  { value: 'all', label: 'All Services' },
  { value: 'tracks', label: 'Remote Session' },
  { value: 'teach', label: 'Teaching' },
  { value: 'inPerson', label: 'In-Person Gig' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'online', label: 'Online Lessons' },
];
const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: 'low', label: 'Under $50' },
  { value: 'mid', label: '$50 – $150' },
  { value: 'high', label: 'Over $150' },
];

/**
 * Category strip — each entry maps to one or more filter states.
 * The `icon` field is null until icon assets are provided.
 */
const CATEGORIES = [
  { id: 'all',             label: 'All',            icon: '🎵' },
  { id: 'top-rated',       label: 'Top Rated',      icon: '⭐', minRating: 4.5 },
  { id: 'remote',          label: 'Remote',         icon: '🌍', remoteOnly: true },
  { id: 'new',             label: 'New',            icon: '✨', badge: 'new' },
  { id: 'jazz',            label: 'Jazz',           icon: '🎷', genre: 'Jazz' },
  { id: 'classical',       label: 'Classical',      icon: '🎻', genre: 'Classical' },
  { id: 'hip-hop',         label: 'Hip-Hop',        icon: '🎤', genre: 'Hip-Hop' },
  { id: 'rb',              label: 'R&B',            icon: '🎶', genre: 'R&B' },
  { id: 'pop',             label: 'Pop',            icon: '🎤', genre: 'Pop' },
  { id: 'electronic',      label: 'Electronic',     icon: '🎛️', genre: 'Electronic' },
  { id: 'rock',            label: 'Rock',           icon: '🎸', genre: 'Rock' },
  { id: 'afrobeats',       label: 'Afrobeats',      icon: '🥁', genre: 'Afrobeats' },
  { id: 'soul',            label: 'Soul',           icon: '🎹', genre: 'Soul' },
  { id: 'latin',           label: 'Latin',          icon: '🪗', genre: 'Latin' },
  { id: 'cinematic',       label: 'Cinematic',      icon: '🎬', genre: 'Cinematic' },
  { id: 'producer',        label: 'Producer',       icon: '🎚️', skill: 'Beat Making' },
  { id: 'vocalist',        label: 'Vocalist',       icon: '🎙️', skill: 'Vocals' },
  { id: 'engineer',        label: 'Engineer',       icon: '🎧', skill: 'Mixing' },
  { id: 'instrumentalist', label: 'Instrumentalist',icon: '🎶', skill: 'Guitar' },
];

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.197 5.197a7.5 7.5 0 0 0 10.606 10.606Z" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
  );
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function MusicianListingPage({
  musicians: musiciansProp = [],
  onBook,
  onContact,
  isDark = false,
  onThemeToggle,
  className = '',
  ...props
}) {
  const navigate = useNavigate();
  // Read initial search/filter values from URL query params.
  // ?category= maps to the CATEGORIES array — initialises all derived filter states.
  const _urlParams = new URLSearchParams(window.location.search);
  const _initCat = CATEGORIES.find(c => c.id === _urlParams.get('category')) || CATEGORIES[0];

  const [search, setSearch] = useState(_urlParams.get('q') || '');
  const [locationSearch, setLocationSearch] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(Boolean(_initCat.remoteOnly));
  const [minRating, setMinRating] = useState(_initCat.minRating || 0);
  const [serviceType, setServiceType] = useState(_urlParams.get('service') || 'all');
  const [genre, setGenre] = useState(_initCat.genre || 'All Genres');
  const [instrument, setInstrument] = useState(_initCat.skill || 'All Instruments');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(_initCat.id);

  const [apiMusicians, setApiMusicians] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  const debouncedSearch = useDebounce(search, 300);
  const abortRef = useRef(null);

  const fetchMusicians = useCallback(async (filters) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set('vibe', filters.q);
      if (filters.genre !== 'All Genres') params.set('genre', filters.genre);
      if (filters.instrument !== 'All Instruments') params.set('instrument', filters.instrument);
      if (filters.service !== 'all') params.set('service', filters.service);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      params.set('limit', '50');
      const res = await fetch(`${API_BASE}/api/musicians?${params}`, { signal: controller.signal });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setApiMusicians(data.musicians);
      setApiAvailable(true);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setApiAvailable(false);
        setApiMusicians(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMusicians({ q: debouncedSearch, genre, instrument, service: serviceType, sortBy });
  }, [debouncedSearch, genre, instrument, serviceType, sortBy, fetchMusicians]);

  const handleBook = useCallback((musician) => {
    if (onBook) onBook(musician);
    else navigate(`/musicians/${musician.id}`);
  }, [onBook, navigate]);

  const filteredMusicians = useMemo(() => {
    const base = apiAvailable && apiMusicians !== null ? apiMusicians
      : musiciansProp.length ? musiciansProp
      : musiciansData;
    let result = base;
    return result.filter((m) => {
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        m.name.toLowerCase().includes(q) ||
        m.tagline?.toLowerCase().includes(q) ||
        m.genres?.some((g) => g.toLowerCase().includes(q)) ||
        m.skills?.some((s) => s.toLowerCase().includes(q)) ||
        m.bio?.toLowerCase().includes(q);
      const loc = locationSearch.toLowerCase();
      const matchesLocation = !loc || m.location?.toLowerCase().includes(loc);
      const matchesRemote = !remoteOnly || m.remoteAvailable === true || m.remoteAvailable === 1;
      const matchesRating = minRating === 0 || (m.rating ?? m.ratingAverage ?? 0) >= minRating;
      const matchesService = serviceType === 'all' || (() => {
        if (!m.services) return false;
        if (Array.isArray(m.services)) {
          return m.services.some((s) => {
            if (serviceType === 'tracks' || serviceType === 'online') return s.deliveryMode === 'remote' || s.serviceType === 'remote';
            if (serviceType === 'inPerson') return s.deliveryMode === 'in_person' || s.deliveryMode === 'in-person';
            if (serviceType === 'teach') return /lesson|teach/i.test(s.title) || /lesson|teach/i.test(s.serviceType);
            if (serviceType === 'wedding') return /wedding/i.test(s.title) || /wedding/i.test(s.serviceType);
            return false;
          });
        }
        // Mock data shape: object { tracks: true, teach: false, ... }
        return Boolean(m.services[serviceType]);
      })();
      const matchesGenre = genre === 'All Genres' || m.genres?.includes(genre);
      const matchesInstrument = instrument === 'All Instruments' || m.skills?.includes(instrument);
      let matchesPrice = true;
      if (priceRange === 'low') matchesPrice = m.startingPrice < 50;
      else if (priceRange === 'mid') matchesPrice = m.startingPrice >= 50 && m.startingPrice <= 150;
      else if (priceRange === 'high') matchesPrice = m.startingPrice > 150;
      return matchesSearch && matchesLocation && matchesRemote && matchesRating && matchesService && matchesGenre && matchesInstrument && matchesPrice;
    });
  }, [apiAvailable, apiMusicians, musiciansProp, search, locationSearch, remoteOnly, minRating, serviceType, genre, instrument, priceRange]);

  const clearFilters = () => {
    setSearch('');
    setLocationSearch('');
    setRemoteOnly(false);
    setMinRating(0);
    setServiceType('all');
    setGenre('All Genres');
    setInstrument('All Instruments');
    setPriceRange('all');
    setActiveCategory('all');
  };

  /** Select a category chip — maps to the underlying filter states */
  const handleCategorySelect = useCallback((cat) => {
    setActiveCategory(cat.id);
    setGenre(cat.genre || 'All Genres');
    setInstrument(cat.skill || 'All Instruments');
    setRemoteOnly(Boolean(cat.remoteOnly));
    setMinRating(cat.minRating || 0);
  }, []);

  const activeFilters = useMemo(() => {
    const list = [];
    if (remoteOnly) list.push({ id: 'remote', label: '🌍 Remote only', onRemove: () => setRemoteOnly(false) });
    if (serviceType !== 'all') {
      const label = SERVICE_TYPES.find(s => s.value === serviceType)?.label;
      list.push({ id: 'serviceType', label: `Service: ${label}`, onRemove: () => setServiceType('all') });
    }
    if (locationSearch) list.push({ id: 'location', label: `📍 ${locationSearch}`, onRemove: () => setLocationSearch('') });
    if (minRating > 0) list.push({ id: 'rating', label: `${minRating}+ stars`, onRemove: () => setMinRating(0) });
    if (priceRange !== 'all') {
      const label = PRICE_RANGES.find(p => p.value === priceRange)?.label;
      list.push({ id: 'price', label: `Price: ${label}`, onRemove: () => setPriceRange('all') });
    }
    return list;
  }, [remoteOnly, serviceType, locationSearch, minRating, priceRange]);

  return (
    <div className={[styles.page, className].filter(Boolean).join(' ')} {...props}>
      <NavBar isDark={isDark} onThemeToggle={onThemeToggle} />

      {/* ── Compact Page Header: title + search ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>Musicians</h1>
            <p className={styles.pageSubtitle}>
              Hire world-class talent for remote sessions, live events &amp; lessons
            </p>
          </div>

          <div className={styles.searchRow}>
            <div className={styles.searchInputContainer}>
              <span className={styles.searchIcon}><SearchIcon /></span>
              <input
                type="text"
                placeholder="Search by name, vibe, instrument, or genre…"
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search musicians"
              />
            </div>
            <button
              className={styles.filterToggleBtn}
              onClick={() => setIsFilterDrawerOpen(true)}
              aria-label="Open advanced filters"
            >
              <SlidersIcon />
              Filters
              {activeFilters.length > 0 && (
                <span className={styles.filterCount}>{activeFilters.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Category Strip ── */}
      <div className={styles.categoryStripWrapper}>
        <div className={styles.categoryStrip} role="group" aria-label="Browse by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={[
                styles.categoryItem,
                activeCategory === cat.id ? styles.categoryItemActive : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleCategorySelect(cat)}
              aria-pressed={activeCategory === cat.id}
            >
              {/* Icon slot — populated once icon assets are provided */}
              <span className={styles.categoryIconSlot} aria-hidden="true">
                {cat.icon}
              </span>
              <span className={styles.categoryLabel}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Listing Controls Bar ── */}
      <div className={styles.listingControls}>
        <div className={styles.listingControlsInner}>
          <p className={styles.listingCount} aria-live="polite">
            {loading
              ? 'Searching…'
              : <><span className={styles.countBold}>{filteredMusicians.length}</span> musicians found</>
            }
            {!apiAvailable && <span className={styles.offlineNote}> · local results</span>}
          </p>
          <div className={styles.sortSelectWrapper}>
            <span className={styles.sortLabel}>Sort</span>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort musicians"
            >
              <option value="recommended">Recommended</option>
              <option value="topRated">Top Rated</option>
              <option value="mostReviewed">Most Reviewed</option>
              <option value="priceLow">Lowest Price</option>
              <option value="fastestResponse">Fastest Response</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Container: Drawer + Main Grid ── */}
      <div className={styles.container}>

        {/* Filter Drawer Overlay */}
        <div
          className={[styles.drawerOverlay, isFilterDrawerOpen ? styles.drawerOverlayOpen : ''].join(' ')}
          onClick={() => setIsFilterDrawerOpen(false)}
          aria-hidden="true"
        />

        {/* Filter Drawer */}
        <aside
          className={[styles.drawer, isFilterDrawerOpen ? styles.drawerOpen : ''].join(' ')}
          aria-label="Advanced filters"
          aria-hidden={!isFilterDrawerOpen}
        >
          <header className={styles.drawerHeader}>
            <span className={styles.drawerTitle}>Refine Search</span>
            <button className={styles.closeButton} onClick={() => setIsFilterDrawerOpen(false)} aria-label="Close filters">×</button>
          </header>
          <div className={styles.drawerContent}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Instrument / Skill</label>
              <select className={styles.select} value={instrument} onChange={(e) => setInstrument(e.target.value)}>
                {INSTRUMENTS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Genre</label>
              <select className={styles.select} value={genre} onChange={(e) => setGenre(e.target.value)}>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Service Type</label>
              <select className={styles.select} value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                {SERVICE_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Location</label>
              <input
                type="text"
                className={styles.input}
                placeholder="City, Country..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Work mode</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, paddingTop: 4 }}>
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                />
                Remote only (musicians who work worldwide)
              </label>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Minimum Rating</label>
              <select className={styles.select} value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value="0">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Price Range</label>
              <select className={styles.select} value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                {PRICE_RANGES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <footer className={styles.drawerFooter}>
            <Button variant="primary" fullWidth onClick={() => setIsFilterDrawerOpen(false)}>
              Show Results
            </Button>
            <Button variant="ghost" onClick={clearFilters}>Reset</Button>
          </footer>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {activeFilters.length > 0 && (
            <div className={styles.activeFiltersRow}>
              {activeFilters.map(filter => (
                <div key={filter.id} className={styles.activeFilterChip}>
                  <span className={styles.chipLabel}>{filter.label}</span>
                  <button className={styles.removeChip} onClick={filter.onRemove} aria-label={`Remove ${filter.label} filter`}>×</button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>
            </div>
          )}

          <MusicianGrid
            musicians={filteredMusicians}
            loading={loading}
            onBook={handleBook}
            onContact={onContact}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default MusicianListingPage;
