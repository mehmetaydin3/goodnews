import { Typography } from '../../ui/Typography/Typography';
import { RatingStars } from '../../ui/RatingStars/RatingStars';
import styles from './TestimonialCarousel.module.css';

const TESTIMONIALS = [
  {
    id: 't1',
    quote: 'I found the most incredible jazz pianist for my restaurant launch in under 10 minutes. The audio previews made all the difference.',
    name: 'Sophie Laurent',
    role: 'Restaurant Owner, Paris',
    avatar: 'https://i.pravatar.cc/80?img=1',
    rating: 5,
    category: 'Live Event',
  },
  {
    id: 't2',
    quote: 'Elena\'s string quartet made our wedding ceremony honestly magical. Every guest commented on how beautiful the music was.',
    name: 'James & Amara O.',
    role: 'Newlyweds, London',
    avatar: 'https://i.pravatar.cc/80?img=9',
    rating: 5,
    category: 'Wedding',
  },
  {
    id: 't3',
    quote: 'As a producer shipping beats, this platform connected me with a vocalist who nailed my track in a single take. Mind-blowing.',
    name: 'Tyler Eason',
    role: 'Independent Producer, Atlanta',
    avatar: 'https://i.pravatar.cc/80?img=53',
    rating: 5,
    category: 'Remote Session',
  },
  {
    id: 't4',
    quote: 'Devon taught me everything I know about synthesis. The online lesson format and direct messaging made it so easy to keep learning.',
    name: 'Arno B.',
    role: 'Music Student, Berlin',
    avatar: 'https://i.pravatar.cc/80?img=25',
    rating: 5,
    category: 'Online Lesson',
  },
];

export function TestimonialCarousel({ className = '', ...props }) {
  return (
    <section
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-label="Customer testimonials"
      {...props}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <Typography as="h2" variant="heading2" className={styles.title}>
            The booking experience
          </Typography>
          <Typography variant="body" className={styles.subtitle}>
            What connecting with the right musician through Prova can look like.
          </Typography>
        </div>

        <div className={styles.grid} role="list">
          {TESTIMONIALS.map((t) => (
            <article key={t.id} className={styles.card} role="listitem">
              <div className={styles.cardTop}>
                <span className={styles.category}>{t.category}</span>
                <RatingStars rating={t.rating} size="sm" showCount={false} />
              </div>

              <blockquote className={styles.quote}>
                <span className={styles.quoteDecor} aria-hidden="true">"</span>
                {t.quote}
              </blockquote>

              <div className={styles.author}>
                <img src={t.avatar} alt="" className={styles.avatar} loading="lazy" />
                <div>
                  <Typography as="p" variant="label" className={styles.authorName}>{t.name}</Typography>
                  <Typography as="p" variant="caption" className={styles.authorRole}>{t.role}</Typography>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialCarousel;
