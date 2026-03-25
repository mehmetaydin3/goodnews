import { useState } from 'react';
import { Typography } from '../../ui/Typography/Typography';
import { Button } from '../../ui/Button/Button';
import styles from './ServicePackages.module.css';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$' };

const TIER_META = {
  Basic: { label: 'Basic', accent: '#52525B' },
  Standard: { label: 'Standard', accent: '#7928CA' },
  Premium: { label: 'Premium', accent: '#D10068' },
};

export function ServicePackages({
  packages = [],
  currency = 'USD',
  onSelect,
  className = '',
  ...props
}) {
  const [selected, setSelected] = useState(0);
  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

  const handleSelect = (idx) => {
    setSelected(idx);
    onSelect?.(packages[idx]);
  };

  return (
    <section
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-label="Service packages"
      {...props}
    >
      <Typography as="h2" variant="heading2" className={styles.title}>
        Choose a Package
      </Typography>

      <div className={styles.grid}>
        {packages.map((pkg, idx) => {
          const meta = TIER_META[pkg.name] || { label: pkg.name, accent: '#7928CA' };
          const isSelected = selected === idx;
          return (
            <button
              key={pkg.name}
              className={[styles.card, isSelected ? styles.cardSelected : ''].filter(Boolean).join(' ')}
              style={{ '--accent': meta.accent }}
              onClick={() => handleSelect(idx)}
              aria-pressed={isSelected}
              aria-label={`${pkg.name} package – ${currencySymbol}${pkg.price}`}
            >
              <div className={styles.cardAccent} aria-hidden="true" />
              <div className={styles.cardHeader}>
                <span className={styles.tierBadge}>{meta.label}</span>
                {isSelected && <span className={styles.selectedMark}>✓ Selected</span>}
              </div>

              <div className={styles.pricing}>
                <span className={styles.priceAmount}>{currencySymbol}{pkg.price}</span>
                {pkg.delivery && pkg.delivery !== '—' && (
                  <span className={styles.delivery}>Delivery: {pkg.delivery}</span>
                )}
                {pkg.revisions != null && (
                  <span className={styles.revisions}>
                    {pkg.revisions === 'Unlimited' ? '∞ revisions' : `${pkg.revisions} revision${pkg.revisions > 1 ? 's' : ''}`}
                  </span>
                )}
              </div>

              <ul className={styles.features} role="list">
                {pkg.features && pkg.features.length > 0 ? (
                  pkg.features.map((f) => (
                    <li key={f} className={styles.featureItem}>
                      <span className={styles.checkIcon}><CheckIcon /></span>
                      {f}
                    </li>
                  ))
                ) : (
                  <li className={styles.featureItem} style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                    Details shared after booking request
                  </li>
                )}
              </ul>

              <Button
                variant={isSelected ? 'primary' : 'ghost'}
                size="md"
                fullWidth
                tabIndex={-1}
                className={styles.cta}
              >
                {isSelected ? 'Continue with this' : `Select ${pkg.name}`}
              </Button>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ServicePackages;
