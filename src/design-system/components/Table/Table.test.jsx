import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Table from './Table';

describe('Table', () => {
  it('renders basic table structure', () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Age</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>John Doe</Table.Cell>
            <Table.Cell>30</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('handles row clicks when interactive', () => {
    const handleRowClick = vi.fn();
    
    render(
      <Table>
        <Table.Body>
          <Table.Row interactive onClick={handleRowClick}>
            <Table.Cell>Clickable row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    const row = screen.getByRole('button');
    fireEvent.click(row);
    expect(handleRowClick).toHaveBeenCalledTimes(1);
  });

  it('handles sortable headers', () => {
    const handleSort = vi.fn();
    
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header sortable onSort={handleSort}>
              Sortable Column
            </Table.Header>
          </Table.Row>
        </Table.Head>
      </Table>
    );
    
    const header = screen.getByRole('button', { name: /sortable column/i });
    fireEvent.click(header);
    expect(handleSort).toHaveBeenCalledWith('asc');
  });

  it('shows sort indicators', () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header sortable sorted="asc">
              Ascending
            </Table.Header>
            <Table.Header sortable sorted="desc">
              Descending
            </Table.Header>
          </Table.Row>
        </Table.Head>
      </Table>
    );
    
    const ascHeader = screen.getByRole('button', { name: /ascending/i });
    const descHeader = screen.getByRole('button', { name: /descending/i });
    
    expect(ascHeader).toHaveAttribute('aria-sort', 'asc');
    expect(descHeader).toHaveAttribute('aria-sort', 'desc');
  });

  it('applies variant classes correctly', () => {
    const { container, rerender } = render(
      <Table variant="dense">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Content</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    expect(container.querySelector('table')).toHaveClass(/table--dense/);
    
    rerender(
      <Table variant="striped">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Content</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    expect(container.querySelector('table')).toHaveClass(/table--striped/);
  });

  it('handles cell alignment', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell align="center">Centered</Table.Cell>
            <Table.Cell align="right">Right-aligned</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    const centeredCell = screen.getByText('Centered');
    const rightCell = screen.getByText('Right-aligned');
    
    expect(centeredCell).toHaveClass(/tableCell--center/);
    expect(rightCell).toHaveClass(/tableCell--right/);
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <Table ref={ref}>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Content</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLTableElement));
  });
});