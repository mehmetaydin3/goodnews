import { Typography } from '../../ui/Typography/Typography';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    number: '01',
    icon: '🔍',
    title: 'Search & Filter',
    description: 'Browse musicians by genre, skill, location, and service type. Listen to audio samples before you commit.',
  },
  {
    number: '02',
    icon: '💬',
    title: 'Connect & Discuss',
    description: 'Message musicians directly, share your brief, ask questions, and confirm all the details — no middleman needed.',
  },
  {
    number: '03',
    icon: '✅',
    title: 'Book & Create',
    description: 'Select a package, send your request, and your musician gets to work. Coordinate the details and confirm when you\'re ready.',
  },
];

export function HowItWorks({ className = '', ...props }) {
  return (
    <section
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-label="How it works"
      {...props}
    >
      <div className={styles.header}>
        <Typography as="h2" variant="heading2" className={styles.title}>
          How it works
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          From first search to final delivery — booking a musician has never been simpler.
        </Typography>
      </div>

      <div className={styles.steps}>
        {STEPS.map((step, i) => (
          <div key={step.number} className={styles.step}>
            {/* Connector line */}
            {i < STEPS.length - 1 && <div className={styles.connector} aria-hidden="true" />}

            <div className={styles.stepNumber} aria-hidden="true">{step.number}</div>
            <div className={styles.stepIcon} aria-hidden="true">{step.icon}</div>
            <Typography as="h3" variant="heading3" className={styles.stepTitle}>{step.title}</Typography>
            <Typography variant="bodySmall" className={styles.stepDesc}>{step.description}</Typography>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
