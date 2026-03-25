import { Typography } from '../../ui/Typography/Typography';
import { ProfileCard } from '../features/ProfileCard/ProfileCard';
import styles from './MusicianSection.module.css';

export function MusicianSection({
  title,
  description,
  musicians = [],
  onBook,
  onContact,
  className = '',
  ...props
}) {
  if (!musicians || musicians.length === 0) {
    return null;
  }

  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')} {...props}>
      <header className={styles.header}>
        <Typography as="h2" variant="heading2" className={styles.title}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body" className={styles.description}>
            {description}
          </Typography>
        )}
      </header>

      <div className={styles.grid}>
        {musicians.map((musician) => (
          <ProfileCard
            key={musician.id}
            musician={musician}
            onBook={() => onBook && onBook(musician)}
            onContact={() => onContact && onContact(musician)}
          />
        ))}
      </div>
    </section>
  );
}

export default MusicianSection;
