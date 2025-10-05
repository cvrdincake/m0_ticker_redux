import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/store/useDashboard';
import type { TableConfig } from '@/widgets/registry';

interface TableProps {
  config: TableConfig;
  onConfigChange?: (config: TableConfig) => void;
}

/**
 * Accessible data table widget with dynamic data, sorting, filtering, and pagination.
 *
 * Data resolution order:
 *   1) If config.dataSource is provided, use globalData[dataSource]
 *   2) Else use config.data / config.rows
 *
 * Columns can be an array of strings (keys) or objects { key, label, sortable }.
 * Sorting uses config.columnTypes to decide numeric vs alphabetical compare.
 * Filter is case-insensitive across visible columns.
 */
export default function Table({ config }: TableProps) {
  const { columns = [], pageSize = 10, filter, dataSource, columnOrder, columnTypes = {}, pagination = false } = config;

  // Pull global data map from the store
  const { globalData = {} as Record<string, any[]> } = useDashboardStore.getState() as any;

  // Resolve rows
  const resolvedRows: any[] =
    (dataSource && Array.isArray(globalData?.[dataSource])) ? globalData[dataSource] :
    Array.isArray((config as any).rows) ? (config as any).rows :
    Array.isArray((config as any).data) ? (config as any).data :
    [];

  // Normalise columns to objects
  const normalisedColumns = (columns as any[]).map((col) =>
    typeof col === 'string'
      ? { key: col, label: col, sortable: true }
      : { key: col.key, label: col.label || col.key, sortable: col.sortable !== false }
  );

  // Apply explicit column order if provided
  const orderedColumns = Array.isArray(columnOrder) && columnOrder.length > 0
    ? columnOrder.map((key) => normalisedColumns.find((c) => c.key === key)).filter(Boolean) as typeof normalisedColumns
    : normalisedColumns;

  // Sorting
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const sortedRows = useMemo(() => {
    if (!sortColumn) return resolvedRows;
    const type = (columnTypes as Record<string, 'string' | 'number'>)[sortColumn] || 'string';
    return [...resolvedRows].sort((a, b) => {
      const aVal = a?.[sortColumn];
      const bVal = b?.[sortColumn];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (type === 'number') {
        const an = Number(aVal);
        const bn = Number(bVal);
        if (Number.isNaN(an) || Number.isNaN(bn)) {
          // Fallback to string compare for non-numeric values
          return sortAsc
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        }
        return sortAsc ? an - bn : bn - an;
      }
      // string
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [resolvedRows, sortColumn, sortAsc, columnTypes]);

  // Filter rows (case-insensitive across ordered columns)
  const filteredRows = useMemo(() => {
    const q = (filter || '').trim().toLowerCase();
    if (!q) return sortedRows;
    const keys = orderedColumns.map((c) => c.key);
    return sortedRows.filter((row) =>
      keys.some((k) => String(row?.[k] ?? '').toLowerCase().includes(q))
    );
  }, [sortedRows, filter, orderedColumns]);

  // Pagination (optional)
  const [page, setPage] = useState<number>(0);
  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = useMemo(() => {
    if (!pagination) return filteredRows;
    const start = page * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize, pagination]);

  const prevPage = () => setPage((p) => Math.max(0, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const onHeaderClick = (key: string, sortable = true) => {
    if (!sortable) return;
    if (sortColumn === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(key);
      setSortAsc(true);
    }
    if (pagination) setPage(0);
  };

  if (resolvedRows.length === 0) {
    return (
      <div
        role="region"
        aria-label={config.ariaLabel || 'Empty data table'}
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
            {orderedColumns.map((col) => (
              <th
                key={col.key}
                role="columnheader"
                scope="col"
                onClick={() => onHeaderClick(col.key, col.sortable)}
                aria-sort={sortColumn === col.key ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                style={{
                  cursor: col.sortable ? 'pointer' : 'default',
                  textAlign: 'left',
                  padding: '0.5rem',
                  borderBottom: '1px solid var(--border)',
                  whiteSpace: 'nowrap'
                }}
              >
                {col.label}
                {col.sortable && (sortColumn === col.key ? (sortAsc ? ' ▲' : ' ▼') : '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, idx) => (
            <tr key={idx} role="row">
              {orderedColumns.map((col) => (
                <td
                  key={col.key}
                  role="cell"
                  style={{
                    padding: '0.5rem',
                    borderBottom: '1px solid var(--border)',
                    fontSize: 'var(--text-sm)'
                  }}
                >
                  {row?.[col.key] != null ? String(row[col.key]) : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div
          style={{
            marginTop: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
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
