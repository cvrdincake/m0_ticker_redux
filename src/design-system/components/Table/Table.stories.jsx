import { useState } from 'react';
import Table from './Table';

export default {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Data table component with sorting, selection, and responsive features.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'dense', 'striped'],
      description: 'Table style variant'
    },
    interactive: {
      control: 'boolean',
      description: 'Whether rows are clickable'
    }
  }
};

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Manager', status: 'Inactive' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Developer', status: 'Active' },
];

export const Default = () => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Header>Name</Table.Header>
        <Table.Header>Email</Table.Header>
        <Table.Header>Role</Table.Header>
        <Table.Header>Status</Table.Header>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {sampleData.map((user) => (
        <Table.Row key={user.id}>
          <Table.Cell>{user.name}</Table.Cell>
          <Table.Cell>{user.email}</Table.Cell>
          <Table.Cell>{user.role}</Table.Cell>
          <Table.Cell>{user.status}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
    <div>
      <h4>Default</h4>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Role</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>John Doe</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
    
    <div>
      <h4>Dense</h4>
      <Table variant="dense">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Role</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>John Doe</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
    
    <div>
      <h4>Striped</h4>
      <Table variant="striped">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Role</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {sampleData.slice(0, 3).map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  </div>
);

export const Sortable = () => {
  const [data, setData] = useState(sampleData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  
  const handleSort = (key) => (direction) => {
    const sortedData = [...data].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    
    setData(sortedData);
    setSortConfig({ key, direction });
  };
  
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header 
            sortable 
            sorted={sortConfig.key === 'name' ? sortConfig.direction : null}
            onSort={handleSort('name')}
          >
            Name
          </Table.Header>
          <Table.Header 
            sortable 
            sorted={sortConfig.key === 'email' ? sortConfig.direction : null}
            onSort={handleSort('email')}
          >
            Email
          </Table.Header>
          <Table.Header 
            sortable 
            sorted={sortConfig.key === 'role' ? sortConfig.direction : null}
            onSort={handleSort('role')}
          >
            Role
          </Table.Header>
          <Table.Header>Status</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {data.map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>{user.role}</Table.Cell>
            <Table.Cell>{user.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const Interactive = () => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Header>Name</Table.Header>
        <Table.Header>Role</Table.Header>
        <Table.Header>Actions</Table.Header>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {sampleData.map((user) => (
        <Table.Row 
          key={user.id} 
          interactive 
          onClick={() => alert(`Clicked on ${user.name}`)}
        >
          <Table.Cell>{user.name}</Table.Cell>
          <Table.Cell>{user.role}</Table.Cell>
          <Table.Cell>
            <button 
              style={{ 
                background: 'transparent', 
                border: '1px solid var(--border)', 
                color: 'var(--ink)', 
                padding: '4px 8px',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '11px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                alert(`Edit ${user.name}`);
              }}
            >
              Edit
            </button>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

export const CellAlignment = () => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Header>Left (Default)</Table.Header>
        <Table.Header>Center</Table.Header>
        <Table.Header>Right</Table.Header>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Left aligned text</Table.Cell>
        <Table.Cell align="center">Centered text</Table.Cell>
        <Table.Cell align="right">Right aligned</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>More left text</Table.Cell>
        <Table.Cell align="center">More center</Table.Cell>
        <Table.Cell align="right">$1,234.56</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

// Dark theme variant
export const DarkTheme = () => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Header>Name</Table.Header>
        <Table.Header>Role</Table.Header>
        <Table.Header>Status</Table.Header>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {sampleData.slice(0, 2).map((user) => (
        <Table.Row key={user.id}>
          <Table.Cell>{user.name}</Table.Cell>
          <Table.Cell>{user.role}</Table.Cell>
          <Table.Cell>{user.status}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

DarkTheme.parameters = {
  backgrounds: { default: 'dark' }
};