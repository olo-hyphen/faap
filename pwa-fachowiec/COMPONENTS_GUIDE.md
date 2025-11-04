# Fachowiec PWA - Components Guide

## Table of Contents
- [Component Architecture](#component-architecture)
- [Core Components](#core-components)
- [Component Patterns](#component-patterns)
- [Styling Guide](#styling-guide)
- [Best Practices](#best-practices)

---

## Component Architecture

### Overview

The Fachowiec PWA follows a simple, maintainable component structure:

```
src/
├── App.jsx              # Root application component
├── main.jsx             # Application entry point
└── components/          # Reusable components (future)
    ├── JobList.jsx
    ├── JobForm.jsx
    └── JobItem.jsx
```

### Component Hierarchy

```
App (Root)
├── JobForm (Add new jobs)
└── JobList (Display jobs)
    └── JobItem (Individual job)
        ├── JobStatus
        ├── JobActions
        └── JobEdit
```

---

## Core Components

### App Component

**Location:** `src/App.jsx`

The root component managing the entire application state and layout.

#### Component Signature

```jsx
function App(): JSX.Element
```

#### State Management

```jsx
const [jobs, setJobs] = useState<Job[]>([])
const [newJob, setNewJob] = useState<string>('')
```

**State Variables:**

| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| `jobs` | `Array<Job>` | `[]` | List of all jobs from IndexedDB |
| `newJob` | `string` | `''` | Input value for new job description |

#### Lifecycle Methods

**Mount Phase:**
```jsx
useEffect(() => {
  const fetchJobs = async () => {
    const allJobs = await getAllJobs();
    setJobs(allJobs);
  };
  fetchJobs();
}, []);
```

**Behavior:**
- Runs once on component mount
- Fetches all jobs from IndexedDB
- Populates `jobs` state

#### Event Handlers

##### `handleAddJob(e: FormEvent)`

Handles new job submission.

```jsx
const handleAddJob = async (e) => {
  e.preventDefault();
  if (newJob.trim() === '') return;

  await saveJob({ description: newJob, status: 'Lokalny' });
  setNewJob('');
  const allJobs = await getAllJobs();
  setJobs(allJobs);
};
```

**Flow:**
1. Prevent default form submission
2. Validate input (non-empty)
3. Save job to IndexedDB
4. Clear input field
5. Refresh job list

**Validation Rules:**
- Description cannot be empty
- Whitespace-only input is rejected

#### Render Structure

```jsx
return (
  <>
    <h1>PWA Fachowiec</h1>
    
    {/* Job Creation Section */}
    <div className="card">
      <h2>Nowe Zlecenie</h2>
      <form onSubmit={handleAddJob}>
        <input 
          type="text"
          value={newJob}
          onChange={(e) => setNewJob(e.target.value)}
          placeholder="Opis zlecenia"
        />
        <button type="submit">Dodaj Zlecenie</button>
      </form>
    </div>

    {/* Job List Section */}
    <div className="card">
      <h2>Lista Zleceń</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            {job.description} - <strong>{job.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  </>
);
```

#### Props

None - This is the root component.

#### Usage Example

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## Component Patterns

### Extracting Reusable Components

As the application grows, extract components for better maintainability:

### JobForm Component

```jsx
// src/components/JobForm.jsx
import { useState } from 'react';
import { saveJob } from '../data/jobStore';

/**
 * Form component for creating new jobs
 * @param {Object} props
 * @param {Function} props.onJobAdded - Callback after job is added
 */
export function JobForm({ onJobAdded }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (description.trim() === '') {
      setError('Opis nie może być pusty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await saveJob({ 
        description, 
        status: 'Lokalny',
        createdAt: new Date().toISOString()
      });
      
      setDescription('');
      onJobAdded?.();
    } catch (err) {
      setError('Nie udało się dodać zlecenia');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Nowe Zlecenie</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Opis zlecenia"
          disabled={loading}
          aria-label="Opis zlecenia"
        />
        
        <button 
          type="submit" 
          disabled={loading || !description.trim()}
        >
          {loading ? 'Dodawanie...' : 'Dodaj Zlecenie'}
        </button>
        
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

// Usage:
// <JobForm onJobAdded={loadJobs} />
```

**Features:**
- Loading state during submission
- Error handling with user feedback
- Accessibility attributes (aria-label, role)
- Disabled state management
- Callback prop for parent notification

---

### JobList Component

```jsx
// src/components/JobList.jsx
import { JobItem } from './JobItem';

/**
 * Display list of jobs
 * @param {Object} props
 * @param {Array} props.jobs - Array of job objects
 * @param {Function} props.onJobUpdate - Callback when job is updated
 * @param {Function} props.onJobDelete - Callback when job is deleted
 */
export function JobList({ jobs, onJobUpdate, onJobDelete }) {
  if (jobs.length === 0) {
    return (
      <div className="card">
        <h2>Lista Zleceń</h2>
        <p className="empty-state">
          Brak zleceń. Dodaj pierwsze zlecenie powyżej.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Lista Zleceń ({jobs.length})</h2>
      
      <ul className="job-list">
        {jobs.map(job => (
          <JobItem
            key={job.id}
            job={job}
            onUpdate={onJobUpdate}
            onDelete={onJobDelete}
          />
        ))}
      </ul>
    </div>
  );
}

// Usage:
// <JobList 
//   jobs={jobs} 
//   onJobUpdate={handleUpdate}
//   onJobDelete={handleDelete}
// />
```

**Features:**
- Empty state handling
- Job count display
- Prop drilling to child components
- Semantic HTML (ul/li)

---

### JobItem Component

```jsx
// src/components/JobItem.jsx
import { useState } from 'react';

/**
 * Individual job item with edit/delete capabilities
 * @param {Object} props
 * @param {Object} props.job - Job object
 * @param {Function} props.onUpdate - Update callback
 * @param {Function} props.onDelete - Delete callback
 */
export function JobItem({ job, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(job.description);

  const handleSave = () => {
    onUpdate?.(job.id, { description: editDescription });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditDescription(job.description);
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Czy na pewno chcesz usunąć zlecenie: "${job.description}"?`)) {
      onDelete?.(job.id);
    }
  };

  const handleStatusChange = (newStatus) => {
    onUpdate?.(job.id, { status: newStatus });
  };

  if (editing) {
    return (
      <li className="job-item editing">
        <input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          autoFocus
        />
        
        <div className="actions">
          <button onClick={handleSave} className="btn-save">
            Zapisz
          </button>
          <button onClick={handleCancel} className="btn-cancel">
            Anuluj
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="job-item">
      <div className="job-content">
        <span className="job-description">{job.description}</span>
        
        <select
          value={job.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="status-select"
        >
          <option value="Lokalny">Lokalny</option>
          <option value="In Progress">W trakcie</option>
          <option value="Completed">Zakończone</option>
          <option value="Cancelled">Anulowane</option>
        </select>
      </div>
      
      <div className="actions">
        <button onClick={() => setEditing(true)} className="btn-edit">
          Edytuj
        </button>
        <button onClick={handleDelete} className="btn-delete">
          Usuń
        </button>
      </div>
    </li>
  );
}

// Usage:
// <JobItem 
//   job={job}
//   onUpdate={updateJob}
//   onDelete={deleteJob}
// />
```

**Features:**
- Inline editing mode
- Status dropdown
- Delete confirmation
- Edit mode toggle
- Controlled input components

---

### JobFilter Component

```jsx
// src/components/JobFilter.jsx
import { useState } from 'react';

/**
 * Filter and search jobs
 * @param {Object} props
 * @param {Function} props.onSearch - Search callback
 * @param {Function} props.onFilterChange - Filter callback
 */
export function JobFilter({ onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    onFilterChange?.(value);
  };

  return (
    <div className="card filter-card">
      <div className="filter-controls">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Szukaj zlecenia..."
          className="search-input"
        />
        
        <select
          value={selectedFilter}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="all">Wszystkie</option>
          <option value="Lokalny">Lokalny</option>
          <option value="In Progress">W trakcie</option>
          <option value="Completed">Zakończone</option>
          <option value="Cancelled">Anulowane</option>
        </select>
      </div>
    </div>
  );
}

// Usage:
// <JobFilter 
//   onSearch={handleSearch}
//   onFilterChange={handleFilter}
// />
```

**Features:**
- Real-time search
- Status filtering
- Controlled components
- Callback-based communication

---

## Styling Guide

### CSS Organization

```css
/* src/App.css */

/* Layout */
.card {
  background: #f5f5f5;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
}

/* Typography */
h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 1rem;
}

h2 {
  color: #555;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* Forms */
input[type="text"],
input[type="search"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

/* Buttons */
button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button.btn-delete {
  background-color: #f44336;
}

button.btn-delete:hover {
  background-color: #da190b;
}

button.btn-edit {
  background-color: #2196F3;
}

button.btn-cancel {
  background-color: #999;
}

/* Job List */
.job-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.job-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin: 10px 0;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.job-item.editing {
  background: #f0f8ff;
}

.job-content {
  flex: 1;
  display: flex;
  gap: 15px;
  align-items: center;
}

.job-description {
  flex: 1;
  font-size: 16px;
}

.status-select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  padding: 5px 15px;
  font-size: 14px;
}

/* Empty State */
.empty-state {
  text-align: center;
  color: #999;
  padding: 40px;
  font-style: italic;
}

/* Error Messages */
.error {
  color: #f44336;
  background: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

/* Loading State */
.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .job-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .job-content {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .actions {
    width: 100%;
    margin-top: 10px;
  }
  
  .actions button {
    flex: 1;
  }
}
```

### CSS Modules Pattern

For larger applications, use CSS Modules:

```jsx
// src/components/JobItem.module.css
.jobItem {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: white;
  border-radius: 4px;
}

.jobItem.editing {
  background: #f0f8ff;
}

// Import in component
import styles from './JobItem.module.css';

export function JobItem({ job }) {
  return (
    <li className={styles.jobItem}>
      {/* content */}
    </li>
  );
}
```

---

## Best Practices

### 1. Component Composition

Break down complex components into smaller, reusable pieces:

```jsx
// ❌ Bad - Monolithic component
function App() {
  // 500 lines of code handling everything
}

// ✅ Good - Composed components
function App() {
  return (
    <>
      <Header />
      <JobForm onJobAdded={loadJobs} />
      <JobFilter onSearch={handleSearch} />
      <JobList jobs={filteredJobs} />
      <Footer />
    </>
  );
}
```

### 2. Props Validation

Use PropTypes or TypeScript for type safety:

```jsx
import PropTypes from 'prop-types';

JobItem.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

JobItem.defaultProps = {
  onUpdate: () => {},
  onDelete: () => {},
};
```

### 3. Error Boundaries

Catch component errors:

```jsx
// src/components/ErrorBoundary.jsx
import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Coś poszło nie tak</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Odśwież stronę
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
// <ErrorBoundary>
//   <App />
// </ErrorBoundary>
```

### 4. Loading States

Always show loading feedback:

```jsx
function JobList({ jobs, loading }) {
  if (loading) {
    return <div className="loading">Ładowanie zleceń...</div>;
  }

  if (jobs.length === 0) {
    return <div className="empty-state">Brak zleceń</div>;
  }

  return (
    <ul>
      {jobs.map(job => <JobItem key={job.id} job={job} />)}
    </ul>
  );
}
```

### 5. Accessibility

Make components accessible:

```jsx
function JobForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} aria-label="Formularz dodawania zlecenia">
      <label htmlFor="job-description">
        Opis zlecenia
      </label>
      
      <input
        id="job-description"
        type="text"
        aria-required="true"
        aria-invalid={hasError}
        aria-describedby="job-description-error"
      />
      
      {hasError && (
        <div id="job-description-error" role="alert">
          Pole nie może być puste
        </div>
      )}
      
      <button type="submit" aria-label="Dodaj nowe zlecenie">
        Dodaj
      </button>
    </form>
  );
}
```

### 6. Performance Optimization

Use memoization for expensive operations:

```jsx
import { useMemo, useCallback } from 'react';

function JobList({ jobs, filter, searchTerm }) {
  // Memoize filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter(job => 
        (filter === 'all' || job.status === filter) &&
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [jobs, filter, searchTerm]);

  // Memoize callbacks
  const handleDelete = useCallback((id) => {
    deleteJob(id);
  }, []);

  return (
    <ul>
      {filteredJobs.map(job => (
        <JobItem 
          key={job.id} 
          job={job}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
```

### 7. Custom Hooks

Extract reusable logic:

```jsx
// src/hooks/useJobForm.js
import { useState } from 'react';
import { saveJob } from '../data/jobStore';

export function useJobForm(onSuccess) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!description.trim()) {
      setError('Opis nie może być pusty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await saveJob({ description, status: 'Lokalny' });
      setDescription('');
      onSuccess?.();
    } catch (err) {
      setError('Nie udało się dodać zlecenia');
    } finally {
      setLoading(false);
    }
  };

  return {
    description,
    setDescription,
    loading,
    error,
    submit,
  };
}

// Usage:
// const { description, setDescription, loading, error, submit } = useJobForm(loadJobs);
```

---

## Testing Components

### Unit Testing with React Testing Library

```jsx
// src/components/__tests__/JobItem.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { JobItem } from '../JobItem';

describe('JobItem', () => {
  const mockJob = {
    id: '1',
    description: 'Test job',
    status: 'Lokalny',
  };

  it('renders job description', () => {
    render(<JobItem job={mockJob} />);
    expect(screen.getByText('Test job')).toBeInTheDocument();
  });

  it('calls onDelete when delete button clicked', () => {
    const mockDelete = jest.fn();
    render(<JobItem job={mockJob} onDelete={mockDelete} />);
    
    fireEvent.click(screen.getByText('Usuń'));
    // Confirm dialog
    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  it('enters edit mode when edit button clicked', () => {
    render(<JobItem job={mockJob} />);
    
    fireEvent.click(screen.getByText('Edytuj'));
    expect(screen.getByDisplayValue('Test job')).toBeInTheDocument();
  });
});
```

---

## Component Checklist

When creating new components, ensure:

- [ ] Single responsibility principle
- [ ] Props are well-documented
- [ ] Error handling implemented
- [ ] Loading states shown
- [ ] Accessibility attributes added
- [ ] Responsive design considered
- [ ] Performance optimized (memo, useMemo, useCallback)
- [ ] Tests written
- [ ] TypeScript types defined (if using TS)
- [ ] CSS follows naming convention

---

**Last Updated:** 2025-11-04  
**Version:** 1.0.0
