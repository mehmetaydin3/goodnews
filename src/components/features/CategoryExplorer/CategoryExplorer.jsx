import { Typography } from '../../ui/Typography/Typography';
import { Button } from '../../ui/Button/Button';
import styles from './CategoryExplorer.module.css';

// Maps category id → listing page service filter param
const SERVICE_PARAM_MAP = {
  remote:  'tracks',
  gig:     'inPerson',
  wedding: 'wedding',
  teach:   'teach',
  online:  'online',
  live:    'inPerson',
};

const CATEGORIES = [
  {
    id: 'remote',
    label: 'Remote Session',
    description: 'Hire producers, vocalists & engineers to record tracks for you, delivered online.',
    icon: '🎧',
    gradient: 'linear-gradient(135deg, #7928CA 0%, #5B0FA8 100%)',
  },
  {
    id: 'gig',
    label: 'Gig & Events',
    description: 'Book live acts, bands, and soloists for your next concert, party, or corporate event.',
    icon: '🎤',
    gradient: 'linear-gradient(135deg, #D10068 0%, #9E0050 100%)',
  },
  {
    id: 'wedding',
    label: 'Wedding Music',
    description: 'Elegant string quartets, jazz trios, and acoustic soloists for your perfect day.',
    icon: '💍',
    gradient: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)',
  },
  {
    id: 'teach',
    label: '1-on-1 Teaching',
    description: 'Expert tutors for guitar, piano, voice, production, and more — online or in-person.',
    icon: '🎓',
    gradient: 'linear-gradient(135deg, #007B75 0%, #004D49 100%)',
  },
  {
    id: 'online',
    label: 'Online Lessons',
    description: 'Learn from home with live video sessions tailored to your pace and goals.',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  },
  {
    id: 'live',
    label: 'Live Performance',
    description: 'Theatrical, concert, and festival performers ready to light up your stage.',
    icon: '🎸',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  },
];

export function CategoryExplorer({ onSelect, className = '', ...props }) {
  return (
    <section
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-label="Explore service categories"
      {...props}
    >
      <div className={styles.header}>
        <Typography as="h2" variant="heading2" className={styles.title}>
          What are you looking for?
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          From intimate lessons to grand performances — find the right musician for any project.
        </Typography>
      </div>

      <div className={styles.grid} role="list">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={styles.tile}
            role="listitem"
            onClick={() => {
              if (onSelect) {
                onSelect(cat.id);
              } else {
                const param = SERVICE_PARAM_MAP[cat.id];
                window.location.href = param ? `/musicians?service=${param}` : '/musicians';
              }
            }}
            aria-label={`Browse ${cat.label}`}
            style={{ '--tile-gradient': cat.gradient }}
          >
            <div className={styles.tileBg} aria-hidden="true" />
            <div className={styles.tileContent}>
              <span className={styles.tileIcon} aria-hidden="true">{cat.icon}</span>
              <Typography as="h3" variant="heading3" className={styles.tileLabel}>{cat.label}</Typography>
              <Typography variant="bodySmall" className={styles.tileDesc}>{cat.description}</Typography>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.cta}>
        <Button variant="ghost" size="lg">Browse all categories</Button>
      </div>
    </section>
  );
}

export default CategoryExplorer;
