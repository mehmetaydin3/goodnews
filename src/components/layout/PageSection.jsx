import styles from './PageSection.module.css';

/**
 * PageSection — consistent section wrapper.
 * Handles max-width, horizontal padding, and vertical spacing.
 *
 * size="sm" = 800px max-width (forms, auth, narrow content)
 * size="md" = 1100px max-width (default — most content)
 * size="lg" = 1280px max-width (wide listings, grids)
 * size="full" = 100% (hero banners, full-bleed sections)
 *
 * Usage:
 *   <PageSection as="section" size="md" flush>
 *     …
 *   </PageSection>
 */
export function PageSection({
  as: Tag = 'section',
  size = 'md',
  flush = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={[
        styles.section,
        styles[size],
        flush ? styles.flush : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default PageSection;
