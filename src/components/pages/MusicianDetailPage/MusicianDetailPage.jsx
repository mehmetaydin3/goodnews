import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button/Button';
import { NavBar } from '../../features/NavBar/NavBar';
import { MusicianDetailHero } from '../../features/MusicianDetailHero/MusicianDetailHero';
import { AudioPreview } from '../../ui/AudioPreview/AudioPreview';
import { ServicePackages } from '../../features/ServicePackages/ServicePackages';
import { ReviewList } from '../../features/ReviewList/ReviewList';
import { FeaturedMusicianRow } from '../../features/FeaturedMusicianRow/FeaturedMusicianRow';
import { BookingDrawer } from '../../features/BookingDrawer/BookingDrawer';
import { HowItWorks } from '../../features/HowItWorks/HowItWorks';
import { Footer } from '../../features/Footer/Footer';
import { Typography } from '../../ui/Typography/Typography';
import styles from './MusicianDetailPage.module.css';

const API_BASE = 'http://localhost:5001';

export function MusicianDetailPage({
  musician = {},
  relatedMusicians = [],
  isDark = false,
  onThemeToggle,
  defaultDrawerOpen = false,
  className = '',
  ...props
}) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(defaultDrawerOpen);
  const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);
  // Normalize API field names to the canonical shape expected by child components.
  // API uses headline/ratingAverage/ratingCount/completedJobs/audioSamples[];
  // mocks use tagline/rating/reviewCount/completedGigs/audioSample.
  // This adapter is additive — mock data passes through unchanged.
  const m = {
    ...musician,
    tagline:       musician.tagline      ?? musician.headline     ?? '',
    rating:        musician.rating       ?? musician.ratingAverage ?? 0,
    reviewCount:   musician.reviewCount  ?? musician.ratingCount   ?? 0,
    completedGigs: musician.completedGigs ?? musician.completedJobs ?? null,
    audioSample:   musician.audioSample  ?? musician.audioSamples?.[0] ?? null,
  };

  // Adapt API services shape or fall back to mock packages for Storybook compatibility.
  const rawServices = Array.isArray(m.services) ? m.services : [];
  const services = rawServices.length > 0
    ? rawServices.map(s => ({
        name: s.title,
        price: s.startingPrice,
        delivery: s.turnaroundTime,
        revisions: s.revisionsIncluded ?? null,
        features: Array.isArray(s.deliverables) ? s.deliverables : [],
      }))
    : (m.packages || []);

  return (
    <div className={[styles.page, className].filter(Boolean).join(' ')} {...props}>
      <NavBar isDark={isDark} onThemeToggle={onThemeToggle} />

      <main className={styles.mainContent}>
        <MusicianDetailHero
          musician={m}
          onBook={() => setDrawerOpen(true)}
          onContact={() => {}}
        />

        <div className={styles.grid}>
          <div className={styles.content}>
            {/* About section */}
            <section className={styles.section}>
              <Typography as="h2" className={styles.sectionTitle}>About the Musician</Typography>
              {m.bio && <p className={styles.bio}>{m.bio}</p>}
            </section>

            {/* Media section — uses first item from audioSamples[] or legacy audioSample */}
            {m.audioSample && (
              <section className={styles.section}>
                <Typography as="h2" className={styles.sectionTitle}>Featured Media</Typography>
                <AudioPreview
                  src={m.audioSample.src}
                  title={m.audioSample.title}
                  duration={m.audioSample.duration}
                />
              </section>
            )}

            {/* How it works / Process */}
            <section className={styles.section}>
              <HowItWorks />
            </section>

            {/* Reviews — individual review cards deferred until reviews API exists;
                rating summary block uses real ratingAverage/ratingCount from API */}
            <section className={styles.section}>
              <ReviewList
                reviews={m.reviews || []}
                rating={m.rating}
                reviewCount={m.reviewCount}
              />
            </section>
          </div>

          <aside className={styles.sidebar}>
            {/* Service packages */}
            {services.length > 0 && (
              <ServicePackages
                packages={services}
                currency={m.currency}
                onSelect={(pkg) => {
                  const idx = services.indexOf(pkg);
                  if (idx !== -1) setSelectedServiceIdx(idx);
                  setDrawerOpen(true);
                }}
              />
            )}

            {/* Trust note */}
            <div className={styles.trustNote}>
              <span className={styles.trustNoteIcon} aria-hidden="true">🔒</span>
              <div className={styles.trustNoteBody}>
                <span className={styles.trustNoteTitle}>Safe booking</span>
                <p className={styles.trustNoteText}>
                  No payment is taken until both parties agree.
                  Send a request, review the details, and confirm only when you're ready.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Related musicians */}
        {relatedMusicians.length > 0 && (
          <FeaturedMusicianRow
            musicians={relatedMusicians}
            title="You might also like"
            onBook={(rel) => navigate(`/musicians/${rel.id}`)}
          />
        )}
      </main>

      <Footer />

      {/* Sticky CTA Bar */}
      <div className={styles.stickyBar}>
        <div className={styles.stickyBarContent}>
          <div className={styles.stickyBarInfo}>
            <span className={styles.stickyBarPrice}>
              {m.currency || '$'}{m.startingPrice || '0'}
            </span>
            <span className={styles.stickyBarLabel}>Starting price</span>
          </div>
          <div className={styles.stickyBarActions}>
            <Button variant="ghost" onClick={() => {}}>Message</Button>
            <Button variant="primary" onClick={() => setDrawerOpen(true)}>Book Now</Button>
          </div>
        </div>
      </div>

      <BookingDrawer
        isOpen={drawerOpen}
        musician={m}
        apiBase={API_BASE}
        initialSelectedPkg={selectedServiceIdx}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

export default MusicianDetailPage;
