import { forwardRef } from 'react';
import styles from './Table.module.css';

/**
 * Table - Data table component with sorting and selection
 * @param {string} variant - Table style (default, dense, striped)
 * @param {boolean} interactive - Whether rows are clickable
 * @param {Array} columns - Column configuration
 * @param {Array} data - Table data
 * @param {function} onRowClick - Row click handler
 */
export const Table = forwardRef(({
  variant = 'default',
  interactive = false,
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      <table
        ref={ref}
        className={`
          ${styles.table}
          ${styles[`table--${variant}`]}
          ${interactive ? styles['table--interactive'] : ''}
        `.trim()}
        {...props}
      >
        {children}
      </table>
    </div>
  );
});

Table.displayName = 'Table';

/**
 * Table.Head - Table header section
 */
export const TableHead = ({ className = '', children, ...props }) => (
  <thead className={`${styles.tableHead} ${className}`} {...props}>
    {children}
  </thead>
);

/**
 * Table.Body - Table body section
 */
export const TableBody = ({ className = '', children, ...props }) => (
  <tbody className={`${styles.tableBody} ${className}`} {...props}>
    {children}
  </tbody>
);

/**
 * Table.Row - Table row
 */
export const TableRow = ({ interactive = false, onClick, className = '', children, ...props }) => {
  const isClickable = interactive && onClick;
  
  return (
    <tr
      className={`
        ${styles.tableRow}
        ${isClickable ? styles['tableRow--interactive'] : ''}
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
      {children}
    </tr>
  );
};

/**
 * Table.Header - Table header cell
 */
export const TableHeader = ({ sortable = false, sorted, onSort, className = '', children, ...props }) => {
  const handleSort = () => {
    if (sortable && onSort) {
      const nextDirection = sorted === 'asc' ? 'desc' : 'asc';
      onSort(nextDirection);
    }
  };

  return (
    <th
      className={`
        ${styles.tableHeader}
        ${sortable ? styles['tableHeader--sortable'] : ''}
        ${sorted ? styles[`tableHeader--sorted-${sorted}`] : ''}
        ${className}
      `.trim()}
      onClick={sortable ? handleSort : undefined}
      role={sortable ? 'button' : undefined}
      tabIndex={sortable ? 0 : undefined}
      aria-sort={sorted || (sortable ? 'none' : undefined)}
      {...props}
    >
      <div className={styles.headerContent}>
        {children}
        {sortable && (
          <span className={styles.sortIcon} aria-hidden="true">
            {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  );
};

/**
 * Table.Cell - Table data cell
 */
export const TableCell = ({ align = 'left', className = '', children, ...props }) => (
  <td
    className={`
      ${styles.tableCell}
      ${styles[`tableCell--${align}`]}
      ${className}
    `.trim()}
    {...props}
  >
    {children}
  </td>
);

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;

export default Table;