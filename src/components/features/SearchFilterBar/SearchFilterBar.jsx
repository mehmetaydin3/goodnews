import { useState } from 'react';
import styles from './SearchFilterBar.module.css';

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
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'reviews', label: 'Most Reviews' },
];

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export function SearchFilterBar({
  onFilterChange,
  initialFilters = {},
  resultCount,
  className = '',
  ...props
}) {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [serviceType, setServiceType] = useState(initialFilters.serviceType || 'all');
  const [genre, setGenre] = useState(initialFilters.genre || 'All Genres');
  const [instrument, setInstrument] = useState(initialFilters.instrument || 'All Instruments');
  const [onlineOnly, setOnlineOnly] = useState(initialFilters.onlineOnly || false);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'featured');

  const notify = (updates) => {
    onFilterChange?.({ search, serviceType, genre, instrument, onlineOnly, sortBy, ...updates });
  };

  const handleSearch = (val) => { setSearch(val); notify({ search: val }); };
  const handleService = (val) => { setServiceType(val); notify({ serviceType: val }); };
  const handleGenre = (val) => { setGenre(val); notify({ genre: val }); };
  const handleInstrument = (val) => { setInstrument(val); notify({ instrument: val }); };
  const handleOnline = (val) => { setOnlineOnly(val); notify({ onlineOnly: val }); };
  const handleSort = (val) => { setSortBy(val); notify({ sortBy: val }); };

  const clearAll = () => {
    setSearch(''); setServiceType('all'); setGenre('All Genres'); setInstrument('All Instruments'); setOnlineOnly(false); setSortBy('featured');
    onFilterChange?.({ search: '', serviceType: 'all', genre: 'All Genres', instrument: 'All Instruments', onlineOnly: false, sortBy: 'featured' });
  };

  const hasActiveFilters = search !== '' || serviceType !== 'all' || genre !== 'All Genres' || instrument !== 'All Instruments' || onlineOnly;

  return (
    <div
      className={[styles.bar, className].filter(Boolean).join(' ')}
      role="search"
      aria-label="Filter musicians"
      {...props}
    >
      <div className={styles.inner}>
        {/* Search input */}
        <div className={styles.searchField}>
          <SearchIcon />
          <input
            type="search"
            className={styles.searchInput}
            placeholder='Search by name, genre, instrument…'
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search musicians"
          />
        </div>

        {/* Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Service type */}
        <div className={styles.filterGroup}>
          <FilterIcon />
          <select
            className={styles.select}
            value={serviceType}
            onChange={(e) => handleService(e.target.value)}
            aria-label="Filter by service type"
          >
            {SERVICE_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Instrument */}
        <div className={styles.filterGroup}>
          <select
            className={styles.select}
            value={instrument}
            onChange={(e) => handleInstrument(e.target.value)}
            aria-label="Filter by instrument"
          >
            {INSTRUMENTS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        {/* Genre */}
        <div className={styles.filterGroup}>
          <select
            className={styles.select}
            value={genre}
            onChange={(e) => handleGenre(e.target.value)}
            aria-label="Filter by genre"
          >
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Online only toggle */}
        <label className={styles.toggle}>
          <input
            type="checkbox"
            className={styles.toggleInput}
            checked={onlineOnly}
            onChange={(e) => handleOnline(e.target.checked)}
          />
          <span className={[styles.toggleTrack, onlineOnly ? styles.toggleOn : ''].filter(Boolean).join(' ')}>
            <span className={styles.toggleThumb} />
          </span>
          <span className={styles.toggleLabel}>Available now</span>
        </label>

        {/* Sort */}
        <div className={styles.filterGroup} style={{ marginLeft: 'auto' }}>
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            aria-label="Sort results"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {hasActiveFilters && (
          <button className={styles.clearBtn} onClick={clearAll} aria-label="Clear all filters">
            Clear
          </button>
        )}
      </div>

      {resultCount != null && (
        <div className={styles.resultCount} aria-live="polite">
          <span className={styles.count}>{resultCount}</span> musicians found
        </div>
      )}
    </div>
  );
}

export default SearchFilterBar;
