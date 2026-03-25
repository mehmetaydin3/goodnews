import { useState } from 'react';
import { Button } from '../../ui/Button/Button';
import { RotatingText } from '../RotatingText';
import styles from './HeroBanner.module.css';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EVENT_TYPES = [
  'weddings', 
  'parties', 
  'recording sessions', 
  'live events', 
  'gatherings', 
  'private lessons', 
  'corporate events', 
  'festivals', 
  'birthdays', 
  'studio recordings', 
  'concerts', 
  'receptions', 
  'product launches', 
  'intimate dinners', 
  'gala dinners', 
  'masterclasses', 
  'film scores'
];

const CATEGORIES = [
  { label: 'Remote Session', icon: '🎧', service: 'tracks' },
  { label: 'Gig & Events', icon: '🎤', service: 'inPerson' },
  { label: 'Wedding Music', icon: '💍', service: 'wedding' },
  { label: '1-on-1 Teaching', icon: '🎓', service: 'teach' },
  { label: 'Online Lessons', icon: '💻', service: 'online' },
  { label: 'Live Performance', icon: '🎸', service: 'inPerson' },
];

const VALUE_PROPS = [
  { value: 'Direct', label: 'Booking & messaging' },
  { value: 'Vetted', label: 'Musician profiles' },
  { value: 'Flexible', label: 'Services & pricing' },
  { value: 'Simple', label: 'Request process' },
];

export function HeroBanner({
  headline, // Removing default assignment to handle it inside JSX
  subheadline = 'Connect with session musicians, wedding performers, and private tutors — all in one place.',
  onSearch,
  onCategorySelect,
  className = '',
  ...props
}) {
  const [searchValue, setSearchValue] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (onSearch) {
      onSearch(q);
    } else {
      window.location.href = q ? `/musicians?q=${encodeURIComponent(q)}` : '/musicians';
    }
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat.label);
    if (onCategorySelect) {
      onCategorySelect(cat.label);
    } else {
      window.location.href = cat.service ? `/musicians?service=${cat.service}` : '/musicians';
    }
  };

  return (
    <section
      className={[styles.hero, className].filter(Boolean).join(' ')}
      aria-label="Hero banner"
      {...props}
    >
      {/* Animated orbs */}
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.orb3} aria-hidden="true" />

      <div className={styles.content}>
        {/* Eyebrow */}
        <div className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          <span>Musician marketplace — early access</span>
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>
          {headline || (
            <>
              Hire world-class musicians for <RotatingText words={EVENT_TYPES} />
            </>
          )}
        </h1>
        <p className={styles.subheadline}>{subheadline}</p>

        {/* Search bar */}
        <form className={styles.searchBar} onSubmit={handleSearch} role="search">
          <div className={styles.searchField}>
            <SearchIcon />
            <input
              type="search"
              className={styles.searchInput}
              placeholder='Try "jazz guitarist in London" or "online piano teacher"'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search for musicians"
            />
          </div>
          <Button variant="primary" size="lg" type="submit" className={styles.searchBtn}>
            Search
          </Button>
        </form>

        {/* Category chips */}
        <div className={styles.categories} role="list" aria-label="Service categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              role="listitem"
              className={[styles.chip, activeCategory === cat.label ? styles.chipActive : ''].filter(Boolean).join(' ')}
              onClick={() => handleCategory(cat)}
              aria-pressed={activeCategory === cat.label}
            >
              <span className={styles.chipIcon}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Value props */}
        <div className={styles.stats} aria-label="Platform highlights">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.label} className={styles.stat}>
              <span className={styles.statValue}>{prop.value}</span>
              <span className={styles.statLabel}>{prop.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative musician images mosaic */}
      <div className={styles.mosaic} aria-hidden="true">
        {[12, 47, 34, 11, 5, 60].map((img, i) => (
          <div key={i} className={`${styles.mosaicItem} ${styles[`mosaicItem${i + 1}`]}`}>
            <img src={`https://i.pravatar.cc/200?img=${img}`} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;
