import React, { useState, useMemo } from 'react';
import type { TableConfig } from '@/widgets/registry';

interface TableProps {
  config: TableConfig;
  onConfigChange?: (config: TableConfig) => void;
}

/**
 * Accessible data table widget with sorting and pagination.
 *
 * This implementation expects the config to supply an array of row objects
 * via `rows` (fallback to `data`). The `columns` array defines which keys
 * from each row should be displayed and in what order. Users can click
 * column headers to sort ascending/descending. Pagination controls allow
 * navigating through pages of data. If no rows are provided, a message
 * is shown instead of a table.
 */
export default function Table({ config }: TableProps) {
  const { columns = [], pageSize = 10 } = config;
  // Accept rows from config.rows or config.data; ensure it's an array
  const rows: any[] = Array.isArray((config as any).rows)
    ? (config as any).rows
    : Array.isArray((config as any).data)
    ? (config as any).data
    : [];

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  // Pagination state
  const [page, setPage] = useState<number>(0);

  // Compute sorted rows
  const sortedRows = useMemo(() => {
    if (!sortColumn) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      // Compare numbers or strings
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [rows, sortColumn, sortAsc]);

  // Paginate the sorted rows
  const paginatedRows = useMemo(() => {
    const start = page * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize]);

  // Handle column header click to toggle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(column);
      setSortAsc(true);
    }
    // Reset to first page when sorting changes
    setPage(0);
  };

  // Handle pagination controls
  const totalPages = Math.ceil(rows.length / pageSize);
  const prevPage = () => setPage((p) => Math.max(0, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  // If no data, render a placeholder message
  if (rows.length === 0) {
    return (
      <div
        role="region"
        aria-label={config.ariaLabel || 'Empty table'}
        style={{ padding: '1rem', background: 'var(--surface)', color: 'var(--ink)' }}
      >
        <p>No data available for this table.</p>
      </div>
    );
  }

  return (
    <div role="region" aria-label={config.ariaLabel || 'Data table'}>
      <table role="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                role="columnheader"
                scope="col"
                onClick={() => handleSort(col)}
                aria-sort={sortColumn === col ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                style={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0.5rem',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                {col}
                {sortColumn === col ? (sortAsc ? ' ▲' : ' ▼') : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, idx) => (
            <tr key={idx} role="row">
              {columns.map((col) => (
                <td
                  key={col}
                  role="cell"
                  style={{
                    padding: '0.5rem',
                    borderBottom: '1px solid var(--border)',
                    fontSize: 'var(--text-sm)'
                  }}
                >
                  {row[col] != null ? String(row[col]) : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={prevPage} disabled={page === 0} aria-label="Previous page">
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button onClick={nextPage} disabled={page >= totalPages - 1} aria-label="Next page">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
