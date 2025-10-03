import { Card } from '@/design-system/components';
import { useWidgetMotion } from '@/hooks';
import { forwardRef } from 'react';
import styles from './KPITile.module.css';

export const KPITile = forwardRef(({ 
  label = '',
  value = '',
  unit = '',
  trend = null,
  size = 'medium',
  loading = false,
  error = null,
  ...props 
}, ref) => {
  // Use motion system for proper entrance animation
  useWidgetMotion('kpi', 'entrance');

  if (error) {
    return (
      <Card 
        ref={ref}
        className={`${styles.kpi} ${styles.error}`}
        {...props}
      >
        <div className={styles.errorContent}>
          <div className={styles.errorTitle}>Error loading KPI</div>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card 
        ref={ref}
        className={`${styles.kpi} ${styles.loading} ${styles[size]}`}
        {...props}
      >
        <div className={styles.skeleton}>
          <div className={styles.skeletonLabel}></div>
          <div className={styles.skeletonValue}></div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      ref={ref}
      className={`${styles.kpi} ${styles[size]}`}
      {...props}
    >
      <div className={styles.content}>
        {label && (
          <div className={styles.label}>
            {label}
          </div>
        )}
        
        <div className={styles.valueRow}>
          <div className={styles.value}>
            {value}
          </div>
          
          {unit && (
            <div className={styles.unit}>
              {unit}
            </div>
          )}
        </div>

        {trend && (
          <div className={`${styles.trend} ${styles[trend.direction]}`}>
            <div>
              {trend.value} {trend.period}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});

KPITile.displayName = 'KPITile';
