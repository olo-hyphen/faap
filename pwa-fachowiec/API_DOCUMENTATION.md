# Fachowiec PWA - API Documentation

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Data Layer API](#data-layer-api)
- [Components API](#components-api)
- [PWA Configuration](#pwa-configuration)
- [Build & Deployment](#build--deployment)
- [Examples & Usage](#examples--usage)

---

## Overview

**Fachowiec PWA** is a Progressive Web Application designed for tradespeople (fachowiec = tradesman in Polish) to manage their work orders, clients, and tasks. The application uses IndexedDB for offline-first data storage via LocalForage.

### Tech Stack
- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.12
- **Offline Storage**: LocalForage (IndexedDB wrapper)
- **PWA**: vite-plugin-pwa with Workbox

---

## Project Structure

```
pwa-fachowiec/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   ├── data/
│   │   └── jobStore.js      # Data persistence layer (IndexedDB)
│   ├── assets/              # Static assets
│   ├── App.css              # Component styles
│   └── index.css            # Global styles
├── public/
│   ├── pwa-192x192.png      # PWA icon (192x192)
│   └── pwa-512x512.png      # PWA icon (512x512)
├── vite.config.js           # Vite & PWA configuration
├── package.json             # Dependencies
└── index.html               # HTML entry point
```

---

## Data Layer API

### `jobStore.js`

The data persistence layer using LocalForage for offline-capable storage in IndexedDB.

#### Configuration

```javascript
import localforage from 'localforage';

const jobStore = localforage.createInstance({
  name: "FachowiecPWA",           // Database name
  storeName: "zlecenia",           // Store name (table)
  description: "Zlecenia i zadania klienta"  // Description
});
```

#### API Functions

---

### `saveJob(jobData)`

Saves a new job or updates an existing one in IndexedDB. Works offline.

**Parameters:**
- `jobData` (Object): Job data object
  - `id` (String, optional): Unique identifier. Auto-generated if not provided
  - `description` (String): Job description
  - `status` (String): Job status (default: 'Lokalny')
  - Any other custom fields

**Returns:** 
- `Promise<String>`: The job ID

**Example:**
```javascript
import { saveJob } from './data/jobStore';

// Save a new job
const jobId = await saveJob({
  description: "Install electrical wiring in kitchen",
  status: "Lokalny"
});

// Update existing job
await saveJob({
  id: "1730716800000",
  description: "Install electrical wiring in kitchen - UPDATED",
  status: "In Progress"
});
```

**Implementation Details:**
- Generates unique ID based on timestamp if not provided
- Automatically sets status to 'Lokalny' (Local) for offline tracking
- Overwrites existing job if ID matches
- Returns the job ID for reference

---

### `getAllJobs()`

Retrieves all jobs from IndexedDB. Works offline.

**Parameters:** None

**Returns:**
- `Promise<Array<Object>>`: Array of all job objects

**Example:**
```javascript
import { getAllJobs } from './data/jobStore';

// Fetch all jobs
const jobs = await getAllJobs();

console.log(jobs);
// Output: [
//   { id: "1730716800000", description: "Fix plumbing", status: "Lokalny" },
//   { id: "1730716900000", description: "Paint walls", status: "Completed" }
// ]

// Display in UI
jobs.forEach(job => {
  console.log(`${job.description} - ${job.status}`);
});
```

**Implementation Details:**
- Uses `jobStore.iterate()` to traverse all items
- Returns empty array if no jobs exist
- Non-blocking async operation

---

### Future Extensions

The jobStore module can be extended with additional functions:

```javascript
// Delete a job
export async function deleteJob(id) {
  await jobStore.removeItem(id);
  return true;
}

// Get single job by ID
export async function getJobById(id) {
  return await jobStore.getItem(id);
}

// Update job status
export async function updateJobStatus(id, newStatus) {
  const job = await jobStore.getItem(id);
  if (job) {
    job.status = newStatus;
    await jobStore.setItem(id, job);
  }
  return job;
}

// Clear all jobs
export async function clearAllJobs() {
  await jobStore.clear();
  return true;
}

// Get jobs by status
export async function getJobsByStatus(status) {
  const jobs = [];
  await jobStore.iterate((value) => {
    if (value.status === status) {
      jobs.push(value);
    }
  });
  return jobs;
}

// Sync jobs to server (when online)
export async function syncJobs() {
  const localJobs = await getAllJobs();
  const jobsToSync = localJobs.filter(job => job.status === 'Lokalny');
  
  // Send to server
  const response = await fetch('/api/jobs/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobsToSync)
  });
  
  if (response.ok) {
    // Update local status
    jobsToSync.forEach(async (job) => {
      await updateJobStatus(job.id, 'Synced');
    });
  }
  
  return response;
}
```

---

## Components API

### `App` Component

Main application component that manages job listing and creation.

**Location:** `src/App.jsx`

**Props:** None (root component)

**State:**
- `jobs` (Array): List of all jobs
- `newJob` (String): Input value for new job description

**Lifecycle:**
- **Mount**: Fetches all jobs from IndexedDB via `getAllJobs()`
- **Update**: Re-fetches jobs after adding new job

**Methods:**

#### `handleAddJob(e)`

Handles form submission to add a new job.

**Parameters:**
- `e` (Event): Form submit event

**Behavior:**
1. Prevents default form submission
2. Validates input (non-empty)
3. Calls `saveJob()` with job data
4. Clears input field
5. Refreshes job list

**Example Usage:**
```jsx
<form onSubmit={handleAddJob}>
  <input
    type="text"
    value={newJob}
    onChange={(e) => setNewJob(e.target.value)}
    placeholder="Opis zlecenia"
  />
  <button type="submit">Dodaj Zlecenie</button>
</form>
```

**Component Structure:**
```jsx
function App() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState('');

  useEffect(() => {
    // Load jobs on mount
    const fetchJobs = async () => {
      const allJobs = await getAllJobs();
      setJobs(allJobs);
    };
    fetchJobs();
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (newJob.trim() === '') return;

    await saveJob({ description: newJob, status: 'Lokalny' });
    setNewJob('');
    const allJobs = await getAllJobs();
    setJobs(allJobs);
  };

  return (
    <>
      <h1>PWA Fachowiec</h1>
      {/* Job creation form */}
      {/* Job list display */}
    </>
  );
}
```

**UI Sections:**

1. **New Job Form**
   - Input field for job description
   - Submit button to add job
   - Form validation (no empty jobs)

2. **Job List**
   - Displays all jobs from IndexedDB
   - Shows job description and status
   - Unique key for each list item (job.id)

**Example Extension - Add Delete Functionality:**
```jsx
import { saveJob, getAllJobs, deleteJob } from './data/jobStore';

function App() {
  // ... existing state ...

  const handleDeleteJob = async (jobId) => {
    await deleteJob(jobId);
    const allJobs = await getAllJobs();
    setJobs(allJobs);
  };

  return (
    <>
      <h1>PWA Fachowiec</h1>
      {/* ... form ... */}
      <div className="card">
        <h2>Lista Zleceń</h2>
        <ul>
          {jobs.map(job => (
            <li key={job.id}>
              {job.description} - <strong>{job.status}</strong>
              <button onClick={() => handleDeleteJob(job.id)}>Usuń</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
```

---

### `main.jsx`

Application entry point that renders the root component.

**Location:** `src/main.jsx`

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Purpose:**
- Initializes React root
- Renders App component in StrictMode
- Imports global styles

**StrictMode Benefits:**
- Identifies unsafe lifecycles
- Warns about legacy APIs
- Detects unexpected side effects

---

## PWA Configuration

### Vite PWA Plugin Setup

**Location:** `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true  // Enable PWA in development
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'PWA Fachowiec',
        short_name: 'Fachowiec',
        description: 'Aplikacja PWA dla fachowców',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
```

### PWA Features

#### Auto-Update Strategy
- **Register Type**: `autoUpdate`
- Service worker automatically updates when new version detected
- Users get latest version without manual intervention

#### Development Mode
- PWA features enabled during development
- Test offline functionality locally
- Debug service worker behavior

#### Web App Manifest

```json
{
  "name": "PWA Fachowiec",
  "short_name": "Fachowiec",
  "description": "Aplikacja PWA dla fachowców",
  "theme_color": "#ffffff",
  "icons": [
    {
      "src": "pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Manifest Properties:**
- `name`: Full application name shown during install
- `short_name`: Short name for home screen
- `description`: App description for app stores
- `theme_color`: Browser theme color
- `icons`: App icons for various screen sizes

#### Icon Requirements

| Size | Purpose | File |
|------|---------|------|
| 192x192 | Android devices, Chrome | pwa-192x192.png |
| 512x512 | Splash screens, high-res displays | pwa-512x512.png |

#### Install Behavior

Users can install the app via:
1. Browser's install prompt (desktop)
2. "Add to Home Screen" (mobile)
3. Custom install button (future enhancement)

#### Offline Capabilities

The PWA automatically caches:
- Application shell (HTML, CSS, JS)
- Static assets (icons, images)
- IndexedDB data (via LocalForage)

**Workbox Caching Strategy** (default):
- **CacheFirst**: Assets (JS, CSS, images)
- **NetworkFirst**: API calls (when implemented)
- **StaleWhileRevalidate**: HTML documents

---

## Build & Deployment

### Development Server

Start development server with HMR:

```bash
npm run dev
```

**Output:**
```
  VITE v7.1.12  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

  ➜  PWA: Service worker registered (dev mode)
```

**Features:**
- Hot Module Replacement (HMR)
- PWA enabled in dev mode
- IndexedDB accessible via browser DevTools

### Production Build

Build optimized production bundle:

```bash
npm run build
```

**Output:**
```
vite v7.1.12 building for production...
✓ built in 2.5s
dist/index.html                   0.45 kB │ gzip: 0.30 kB
dist/assets/index-a1b2c3d4.css    1.2 kB  │ gzip: 0.6 kB
dist/assets/index-e5f6g7h8.js     142 kB  │ gzip: 45 kB
dist/sw.js                        2.8 kB  │ gzip: 1.1 kB
dist/manifest.webmanifest         0.3 kB
```

**Build Artifacts:**
- `dist/index.html`: Entry point
- `dist/assets/*.css`: Minified styles
- `dist/assets/*.js`: Bundled JavaScript
- `dist/sw.js`: Service worker
- `dist/manifest.webmanifest`: PWA manifest

### Preview Production Build

Test production build locally:

```bash
npm run preview
```

### Deployment

Deploy to static hosting:

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist

# GitHub Pages
# Push dist/ folder to gh-pages branch

# Cloudflare Pages
# Connect repository, set build command: npm run build, output: dist
```

### Environment Variables

Create `.env` for environment-specific config:

```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Fachowiec PWA (Dev)

# .env.production
VITE_API_URL=https://api.fachowiec.pl
VITE_APP_NAME=Fachowiec PWA
```

**Usage in code:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Examples & Usage

### Complete Job Management Example

```javascript
// src/data/jobStore.js - Extended version
import localforage from 'localforage';

const jobStore = localforage.createInstance({
  name: "FachowiecPWA",
  storeName: "zlecenia",
  description: "Zlecenia i zadania klienta"
});

// Save job
export async function saveJob(jobData) {
  const id = jobData.id || Date.now().toString();
  await jobStore.setItem(id, { 
    ...jobData, 
    id, 
    status: jobData.status || 'Lokalny',
    createdAt: jobData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return id;
}

// Get all jobs
export async function getAllJobs() {
  const jobs = [];
  await jobStore.iterate((value) => {
    jobs.push(value);
  });
  return jobs.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}

// Get job by ID
export async function getJobById(id) {
  return await jobStore.getItem(id);
}

// Update job
export async function updateJob(id, updates) {
  const job = await jobStore.getItem(id);
  if (!job) throw new Error(`Job ${id} not found`);
  
  const updatedJob = {
    ...job,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  await jobStore.setItem(id, updatedJob);
  return updatedJob;
}

// Delete job
export async function deleteJob(id) {
  await jobStore.removeItem(id);
  return true;
}

// Search jobs
export async function searchJobs(query) {
  const jobs = await getAllJobs();
  return jobs.filter(job => 
    job.description.toLowerCase().includes(query.toLowerCase())
  );
}

// Get jobs by status
export async function getJobsByStatus(status) {
  const jobs = await getAllJobs();
  return jobs.filter(job => job.status === status);
}
```

### Enhanced App Component

```jsx
// src/App.jsx - Enhanced version
import { useState, useEffect } from 'react';
import { 
  saveJob, 
  getAllJobs, 
  deleteJob, 
  updateJob,
  searchJobs 
} from './data/jobStore';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, Lokalny, In Progress, Completed
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  // Load jobs on mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const allJobs = await getAllJobs();
    setJobs(allJobs);
  };

  // Add new job
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (newJob.trim() === '') return;

    await saveJob({ 
      description: newJob, 
      status: 'Lokalny',
      priority: 'normal'
    });
    
    setNewJob('');
    await loadJobs();
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    if (confirm('Czy na pewno chcesz usunąć to zlecenie?')) {
      await deleteJob(jobId);
      await loadJobs();
    }
  };

  // Start editing
  const startEdit = (job) => {
    setEditingId(job.id);
    setEditDescription(job.description);
  };

  // Save edit
  const saveEdit = async (jobId) => {
    await updateJob(jobId, { description: editDescription });
    setEditingId(null);
    setEditDescription('');
    await loadJobs();
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditDescription('');
  };

  // Update job status
  const updateStatus = async (jobId, newStatus) => {
    await updateJob(jobId, { status: newStatus });
    await loadJobs();
  };

  // Search jobs
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      await loadJobs();
    } else {
      const results = await searchJobs(query);
      setJobs(results);
    }
  };

  // Filter jobs
  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  return (
    <>
      <h1>PWA Fachowiec</h1>
      
      {/* Add Job Form */}
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

      {/* Search & Filter */}
      <div className="card">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Szukaj zlecenia..."
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Wszystkie</option>
          <option value="Lokalny">Lokalny</option>
          <option value="In Progress">W trakcie</option>
          <option value="Completed">Zakończone</option>
        </select>
      </div>

      {/* Job List */}
      <div className="card">
        <h2>Lista Zleceń ({filteredJobs.length})</h2>
        <ul>
          {filteredJobs.map(job => (
            <li key={job.id}>
              {editingId === job.id ? (
                // Edit mode
                <>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <button onClick={() => saveEdit(job.id)}>Zapisz</button>
                  <button onClick={cancelEdit}>Anuluj</button>
                </>
              ) : (
                // View mode
                <>
                  <span>{job.description}</span>
                  <strong> - {job.status}</strong>
                  
                  {/* Status buttons */}
                  <select 
                    value={job.status}
                    onChange={(e) => updateStatus(job.id, e.target.value)}
                  >
                    <option value="Lokalny">Lokalny</option>
                    <option value="In Progress">W trakcie</option>
                    <option value="Completed">Zakończone</option>
                  </select>
                  
                  <button onClick={() => startEdit(job)}>Edytuj</button>
                  <button onClick={() => handleDeleteJob(job.id)}>Usuń</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
```

### Offline Sync Example

```javascript
// src/utils/syncManager.js
import { getAllJobs, updateJob } from '../data/jobStore';

class SyncManager {
  constructor() {
    this.syncInProgress = false;
    this.registerEventListeners();
  }

  registerEventListeners() {
    // Sync when coming online
    window.addEventListener('online', () => {
      this.syncJobs();
    });

    // Register background sync if available
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('sync-jobs');
      });
    }
  }

  async syncJobs() {
    if (this.syncInProgress) return;
    if (!navigator.onLine) return;

    this.syncInProgress = true;

    try {
      const jobs = await getAllJobs();
      const localJobs = jobs.filter(job => job.status === 'Lokalny');

      if (localJobs.length === 0) {
        console.log('No jobs to sync');
        return;
      }

      // Send to server
      const response = await fetch('/api/jobs/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localJobs)
      });

      if (response.ok) {
        const syncedJobs = await response.json();
        
        // Update local status
        for (const job of localJobs) {
          await updateJob(job.id, { 
            status: 'Synced',
            syncedAt: new Date().toISOString()
          });
        }

        console.log(`Synced ${localJobs.length} jobs`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Manual sync trigger
  async manualSync() {
    return await this.syncJobs();
  }
}

export const syncManager = new SyncManager();
```

### Custom Hook for Job Management

```javascript
// src/hooks/useJobs.js
import { useState, useEffect, useCallback } from 'react';
import { 
  saveJob, 
  getAllJobs, 
  deleteJob, 
  updateJob,
  searchJobs,
  getJobsByStatus 
} from '../data/jobStore';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all jobs
  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allJobs = await getAllJobs();
      setJobs(allJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Add job
  const addJob = useCallback(async (jobData) => {
    try {
      const id = await saveJob(jobData);
      await loadJobs();
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadJobs]);

  // Update job
  const updateJobData = useCallback(async (id, updates) => {
    try {
      await updateJob(id, updates);
      await loadJobs();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadJobs]);

  // Delete job
  const removeJob = useCallback(async (id) => {
    try {
      await deleteJob(id);
      await loadJobs();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadJobs]);

  // Search
  const search = useCallback(async (query) => {
    try {
      setLoading(true);
      const results = await searchJobs(query);
      setJobs(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter by status
  const filterByStatus = useCallback(async (status) => {
    try {
      setLoading(true);
      const results = await getJobsByStatus(status);
      setJobs(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    jobs,
    loading,
    error,
    addJob,
    updateJob: updateJobData,
    deleteJob: removeJob,
    search,
    filterByStatus,
    refresh: loadJobs
  };
}

// Usage in component:
// const { jobs, loading, addJob, deleteJob } = useJobs();
```

### Testing IndexedDB

```javascript
// Test script to verify IndexedDB functionality
async function testJobStore() {
  console.log('Testing Job Store...');

  // Test 1: Save job
  console.log('Test 1: Save job');
  const jobId = await saveJob({
    description: 'Test job',
    status: 'Lokalny'
  });
  console.log('✓ Job saved with ID:', jobId);

  // Test 2: Get all jobs
  console.log('Test 2: Get all jobs');
  const allJobs = await getAllJobs();
  console.log('✓ Found jobs:', allJobs.length);

  // Test 3: Get job by ID
  console.log('Test 3: Get job by ID');
  const job = await getJobById(jobId);
  console.log('✓ Retrieved job:', job);

  // Test 4: Update job
  console.log('Test 4: Update job');
  await updateJob(jobId, { status: 'In Progress' });
  const updatedJob = await getJobById(jobId);
  console.log('✓ Job updated:', updatedJob.status);

  // Test 5: Delete job
  console.log('Test 5: Delete job');
  await deleteJob(jobId);
  const deletedJob = await getJobById(jobId);
  console.log('✓ Job deleted:', deletedJob === null);

  console.log('All tests passed! ✓');
}

// Run tests in browser console
// testJobStore();
```

---

## Advanced Features

### Push Notifications

```javascript
// src/utils/notifications.js
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function showNotification(title, options = {}) {
  if (!('Notification' in window)) return;
  
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      ...options
    });
  }
}

// Usage:
// await requestNotificationPermission();
// showNotification('Nowe zlecenie', { 
//   body: 'Otrzymałeś nowe zlecenie',
//   tag: 'new-job'
// });
```

### Install Prompt

```javascript
// src/utils/installPrompt.js
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install button
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
});

export async function promptInstall() {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User ${outcome} the install prompt`);
  deferredPrompt = null;
  
  return outcome === 'accepted';
}

// In component:
// <button id="install-button" onClick={promptInstall}>
//   Zainstaluj aplikację
// </button>
```

### Background Sync

```javascript
// src/sw.js - Service Worker (if using custom SW)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-jobs') {
    event.waitUntil(syncJobs());
  }
});

async function syncJobs() {
  // Get jobs from IndexedDB
  const db = await openDB('FachowiecPWA');
  const tx = db.transaction('zlecenia', 'readonly');
  const store = tx.objectStore('zlecenia');
  const jobs = await store.getAll();
  
  // Filter local jobs
  const localJobs = jobs.filter(job => job.status === 'Lokalny');
  
  if (localJobs.length === 0) return;
  
  // Send to server
  try {
    const response = await fetch('/api/jobs/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localJobs)
    });
    
    if (response.ok) {
      // Update status in IndexedDB
      const updateTx = db.transaction('zlecenia', 'readwrite');
      const updateStore = updateTx.objectStore('zlecenia');
      
      for (const job of localJobs) {
        job.status = 'Synced';
        await updateStore.put(job);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
    throw error; // Retry on next sync opportunity
  }
}
```

---

## API Reference Summary

### jobStore Functions

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `saveJob(jobData)` | `jobData: Object` | `Promise<String>` | Save or update a job |
| `getAllJobs()` | None | `Promise<Array>` | Get all jobs |
| `getJobById(id)` | `id: String` | `Promise<Object>` | Get single job |
| `updateJob(id, updates)` | `id: String`, `updates: Object` | `Promise<Object>` | Update job |
| `deleteJob(id)` | `id: String` | `Promise<Boolean>` | Delete job |
| `searchJobs(query)` | `query: String` | `Promise<Array>` | Search jobs |
| `getJobsByStatus(status)` | `status: String` | `Promise<Array>` | Filter by status |

### Component Props

| Component | Props | Description |
|-----------|-------|-------------|
| `App` | None | Main application component |

### Hooks

| Hook | Returns | Description |
|------|---------|-------------|
| `useJobs()` | `{ jobs, loading, error, addJob, updateJob, deleteJob, search, filterByStatus, refresh }` | Manage jobs state |

---

## Troubleshooting

### IndexedDB Issues

**Problem:** Data not persisting
```javascript
// Check if IndexedDB is available
if (!window.indexedDB) {
  console.error('IndexedDB not supported');
}

// Check quota
navigator.storage.estimate().then(estimate => {
  console.log(`Using ${estimate.usage} of ${estimate.quota} bytes`);
});
```

**Problem:** Data cleared unexpectedly
- Check browser privacy settings
- Verify not in incognito/private mode
- Check storage quota limits

### PWA Installation Issues

**Problem:** Install prompt not showing
```javascript
// Check PWA criteria
// 1. HTTPS (or localhost)
// 2. Valid manifest.json
// 3. Service worker registered
// 4. Icons present

// Debug manifest
fetch('/manifest.webmanifest')
  .then(r => r.json())
  .then(manifest => console.log('Manifest:', manifest));

// Check service worker
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    console.log('Service workers:', registrations.length);
  });
```

### Offline Functionality

**Problem:** App not working offline
```javascript
// Test offline mode
window.addEventListener('offline', () => {
  console.log('You are offline');
  // Show offline indicator
});

window.addEventListener('online', () => {
  console.log('You are online');
  // Sync data
});

// Check service worker status
navigator.serviceWorker.ready.then(registration => {
  console.log('Service Worker ready:', registration);
});
```

---

## Performance Optimization

### Lazy Loading

```javascript
// Lazy load components
import { lazy, Suspense } from 'react';

const JobList = lazy(() => import('./components/JobList'));

function App() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <JobList />
    </Suspense>
  );
}
```

### Memoization

```javascript
import { useMemo, useCallback } from 'react';

function JobList({ jobs, onDelete }) {
  // Memoize filtered jobs
  const activeJobs = useMemo(() => 
    jobs.filter(job => job.status !== 'Completed'),
    [jobs]
  );

  // Memoize callbacks
  const handleDelete = useCallback((id) => {
    onDelete(id);
  }, [onDelete]);

  return (
    <ul>
      {activeJobs.map(job => (
        <li key={job.id}>
          {job.description}
          <button onClick={() => handleDelete(job.id)}>Usuń</button>
        </li>
      ))}
    </ul>
  );
}
```

### IndexedDB Performance

```javascript
// Batch operations
async function batchSaveJobs(jobsArray) {
  const promises = jobsArray.map(job => saveJob(job));
  return await Promise.all(promises);
}

// Use transactions for multiple operations
async function updateMultipleJobs(updates) {
  // This would require direct IndexedDB access
  const db = await localforage.getSerializer(); // Get underlying DB
  // Perform batch update in single transaction
}
```

---

## Security Considerations

### Input Validation

```javascript
// Validate job data before saving
function validateJobData(jobData) {
  if (!jobData.description || jobData.description.trim() === '') {
    throw new Error('Description is required');
  }
  
  if (jobData.description.length > 500) {
    throw new Error('Description too long (max 500 characters)');
  }
  
  const validStatuses = ['Lokalny', 'In Progress', 'Completed', 'Cancelled'];
  if (jobData.status && !validStatuses.includes(jobData.status)) {
    throw new Error('Invalid status');
  }
  
  return true;
}

// Use in saveJob
export async function saveJob(jobData) {
  validateJobData(jobData);
  // ... rest of save logic
}
```

### XSS Prevention

```javascript
// Sanitize user input
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Use in component
const handleAddJob = async (e) => {
  e.preventDefault();
  const sanitized = sanitizeInput(newJob);
  await saveJob({ description: sanitized, status: 'Lokalny' });
};
```

---

## Contributing

When extending the API:

1. **Follow naming conventions**: Use camelCase for functions, PascalCase for components
2. **Add JSDoc comments**: Document parameters, returns, and examples
3. **Handle errors**: Use try-catch and provide meaningful error messages
4. **Test offline**: Verify functionality works offline
5. **Update documentation**: Add new APIs to this document

**Example contribution:**
```javascript
/**
 * Archive completed jobs older than specified days
 * @param {number} daysOld - Number of days to consider for archiving
 * @returns {Promise<number>} Number of jobs archived
 * @example
 * const archived = await archiveOldJobs(30); // Archive jobs older than 30 days
 */
export async function archiveOldJobs(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const jobs = await getAllJobs();
  const toArchive = jobs.filter(job => 
    job.status === 'Completed' && 
    new Date(job.updatedAt) < cutoffDate
  );
  
  for (const job of toArchive) {
    await updateJob(job.id, { status: 'Archived' });
  }
  
  return toArchive.length;
}
```

---

## License

This documentation is part of the Fachowiec PWA project.

---

**Last Updated:** 2025-11-04  
**Version:** 1.0.0  
**Maintainer:** Development Team
