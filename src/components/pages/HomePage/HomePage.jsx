import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../features/NavBar/NavBar';
import { HeroBanner } from '../../features/HeroBanner/HeroBanner';
import { FeaturedMusicianRow } from '../../features/FeaturedMusicianRow/FeaturedMusicianRow';
import { CategoryExplorer } from '../../features/CategoryExplorer/CategoryExplorer';
import { HowItWorks } from '../../features/HowItWorks/HowItWorks';
import { TestimonialCarousel } from '../../features/TestimonialCarousel/TestimonialCarousel';
import { MusicianCTA } from '../../features/MusicianCTA/MusicianCTA';
import { Footer } from '../../features/Footer/Footer';
import styles from './HomePage.module.css';

export function HomePage({
  musicians = [],
  isDark = false,
  onThemeToggle,
  className = '',
  ...props
}) {
  const navigate = useNavigate();

  const handleBook = (musician) => {
    navigate(`/musicians/${musician.id}`);
  };

  return (
    <div className={[styles.page, className].filter(Boolean).join(' ')} {...props}>
      <NavBar isDark={isDark} onThemeToggle={onThemeToggle} />

      <main>
        <HeroBanner onSearch={(q) => navigate(`/musicians${q ? `?q=${encodeURIComponent(q)}` : ''}`)} />

        <FeaturedMusicianRow
          musicians={musicians.slice(0, 6)}
          title="Featured This Week"
          subtitle="Sample profiles showing the kind of talent you can discover on Prova."
          onBook={handleBook}
        />

        <CategoryExplorer onSelect={(catId) => navigate(`/musicians?category=${catId}`)} />

        <HowItWorks />

        <TestimonialCarousel />

        <MusicianCTA />
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
