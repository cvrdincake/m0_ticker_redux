import { forwardRef } from 'react';
import styles from './Card.module.css';

/**
 * Card - Container component with elevation and interactive states
 * @param {string} variant - Card style (default, elevated, outlined)
 * @param {boolean} interactive - Whether card is clickable/hoverable
 * @param {boolean} loading - Loading state with skeleton content
 * @param {function} onClick - Click handler for interactive cards
 */
export const Card = forwardRef(({
  variant = 'default',
  interactive = false,
  loading = false,
  className = '',
  children,
  onClick,
  ...props
}, ref) => {
  const isClickable = interactive && onClick && !loading;

  return (
    <div
      ref={ref}
      className={`
        ${styles.card}
        ${styles[`card--${variant}`]}
        ${interactive ? styles['card--interactive'] : ''}
        ${loading ? styles['card--loading'] : ''}
        ${className}
      `.trim()}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e);
        }
      } : undefined}
      {...props}
    >
      {loading ? (
        <div className={styles.skeleton}>
          <div className={styles.skeletonHeader} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} style={{ width: '60%' }} />
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
});

Card.displayName = 'Card';

/**
 * Card.Header - Semantic header section
 */
export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`${styles.cardHeader} ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card.Content - Main content area
 */
export const CardContent = ({ className = '', children, ...props }) => (
  <div className={`${styles.cardContent} ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card.Footer - Footer section for actions
 */
export const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`${styles.cardFooter} ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;