import { Typography } from '../../ui/Typography/Typography';
import styles from './DiversityBanner.module.css';

const AVATAR_IMGS = [48, 34, 12, 26, 5, 52, 44, 38, 11, 8, 60, 47];

export function DiversityBanner({ className = '', ...props }) {
  return (
    <section
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-label="Diversity and inclusion"
      {...props}
    >
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span>🌍</span> Our commitment
          </div>
          <Typography as="h2" variant="heading2" className={styles.title}>
            Music belongs to everyone.
          </Typography>
          <Typography variant="body" className={styles.desc}>
            We believe great music transcends borders, backgrounds, and identities. Our platform actively celebrates and amplifies musicians from every culture, genre, gender identity, and experience level — from conservatoire-trained classical soloists to self-taught bedroom producers. Everyone is welcome here.
          </Typography>
          <div className={styles.pillRow}>
            {['All cultures & genres', 'LGBTQ+ inclusive', 'Every skill level', 'Global talent', 'Disability-welcoming'].map((tag) => (
              <span key={tag} className={styles.pill}>{tag}</span>
            ))}
          </div>
        </div>

        <div className={styles.mosaic} aria-hidden="true">
          {AVATAR_IMGS.map((img, i) => (
            <div key={i} className={styles.mosaicItem} style={{ '--delay': `${i * 0.15}s` }}>
              <img src={`https://i.pravatar.cc/100?img=${img}`} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DiversityBanner;
