import { NavBar } from '../features/NavBar/NavBar';
import { Footer } from '../features/Footer/Footer';
import styles from './AppShell.module.css';

/**
 * AppShell — top-level layout wrapper.
 * Provides the sticky NavBar, scrollable main area, and Footer
 * so individual pages don't have to import/repeat this boilerplate.
 *
 * Usage:
 *   <AppShell>
 *     <PageSection>…</PageSection>
 *   </AppShell>
 */
export function AppShell({
  children,
  isDark = false,
  onThemeToggle,
  hideNav = false,
  hideFooter = false,
  className = '',
  ...props
}) {
  return (
    <div className={[styles.shell, className].filter(Boolean).join(' ')} {...props}>
      {!hideNav && <NavBar isDark={isDark} onThemeToggle={onThemeToggle} />}
      <main className={styles.main}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default AppShell;
