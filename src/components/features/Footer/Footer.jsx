import { Typography } from '../../ui/Typography/Typography';
import styles from './Footer.module.css';

const MusicNoteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const FOOTER_LINKS = [
  {
    heading: 'Explore',
    links: ['Find Musicians', 'Remote Sessions', 'Gig & Events', 'Wedding Music', 'Online Lessons', '1-on-1 Teaching'],
  },
  {
    heading: 'For Musicians',
    links: ['Join as a Musician', 'Seller Dashboard', 'Pricing & Fees', 'Success Stories', 'Community Forum'],
  },
  {
    heading: 'Company',
    links: ['About Us', 'Blog', 'Careers', 'Press Kit', 'Partners'],
  },
  {
    heading: 'Support',
    links: ['Help Centre', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Accessibility'],
  },
];

const SOCIALS = [
  { label: 'Instagram', href: '#', icon: '📸' },
  { label: 'Twitter/X', href: '#', icon: '🐦' },
  { label: 'YouTube', href: '#', icon: '▶️' },
  { label: 'TikTok', href: '#', icon: '🎵' },
];

export function Footer({ className = '', ...props }) {
  return (
    <footer
      className={[styles.footer, className].filter(Boolean).join(' ')}
      aria-label="Site footer"
      {...props}
    >
      <div className={styles.inner}>
        {/* Brand column */}
        <div className={styles.brand}>
          <a href="#" className={styles.logo} aria-label="Prova Home">
            <span className={styles.logoIcon}><MusicNoteIcon /></span>
            <span className={styles.logoText}>prova</span>
          </a>
          <Typography variant="bodySmall" className={styles.tagline}>
            The world's leading marketplace for professional musicians.
          </Typography>

          {/* Newsletter */}
          <div className={styles.newsletter}>
            <Typography as="p" variant="label" className={styles.newsletterLabel}>
              Get musician spotlights in your inbox
            </Typography>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className={styles.emailInput}
                placeholder="your@email.com"
                aria-label="Email address for newsletter"
              />
              <button type="submit" className={styles.subscribeBtn}>Subscribe</button>
            </form>
          </div>

          {/* Socials */}
          <div className={styles.socials} aria-label="Social media links">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} className={styles.socialLink} aria-label={s.label} title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className={styles.linkGrid}>
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading} className={styles.linkCol}>
              <Typography as="h3" variant="label" className={styles.colHeading}>{col.heading}</Typography>
              <ul className={styles.linkList} role="list">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className={styles.footerLink}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <Typography variant="caption" className={styles.copyright}>
          © 2026 Prova Ltd. All rights reserved.
        </Typography>
        <div className={styles.badges}>
          <span className={styles.badge}>🔒 Secure Payments</span>
          <span className={styles.badge}>✅ Verified Musicians</span>
          <span className={styles.badge}>♻️ Carbon Neutral</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
