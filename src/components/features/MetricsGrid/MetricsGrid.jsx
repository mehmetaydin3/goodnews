import React from 'react';
import { Typography } from '../../ui/Typography/Typography';
import styles from './MetricsGrid.module.css';

export function MetricsGrid({ metrics = [], className = '', ...props }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className={[styles.gridContainer, className].filter(Boolean).join(' ')} {...props}>
      <div className={styles.grid}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <Typography as="span" variant="display" className={styles.value}>
              {metric.value}
            </Typography>
            <Typography as="span" variant="label" className={styles.label}>
              {metric.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MetricsGrid;
