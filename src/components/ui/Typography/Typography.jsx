import styles from './Typography.module.css';

const variantElementMap = {
  display: 'h1',
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  body: 'p',
  bodySmall: 'p',
  label: 'label',
  caption: 'span',
};

export function Typography({
  as,
  variant = 'body',
  children,
  className = '',
  ...props
}) {
  const Tag = as || variantElementMap[variant] || 'p';

  return (
    <Tag
      className={[styles.base, styles[variant], className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Typography;
