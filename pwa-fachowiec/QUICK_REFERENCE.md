# Fachowiec PWA - Quick Reference Guide

A quick reference for common tasks and API usage.

---

## Table of Contents
- [Installation & Setup](#installation--setup)
- [Common Tasks](#common-tasks)
- [API Quick Reference](#api-quick-reference)
- [Component Quick Reference](#component-quick-reference)
- [PWA Features](#pwa-features)
- [Troubleshooting](#troubleshooting)
- [Keyboard Shortcuts](#keyboard-shortcuts)

---

## Installation & Setup

### Quick Start
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Common Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

---

## Common Tasks

### Add a Job
```javascript
import { saveJob } from './src/data/jobStore';

const jobId = await saveJob({
  description: "Install new sink",
  status: "Lokalny"
});
```

### Get All Jobs
```javascript
import { getAllJobs } from './src/data/jobStore';

const jobs = await getAllJobs();
```

### Search Jobs (Future)
```javascript
import { searchJobs } from './src/data/jobStore';

const results = await searchJobs('bathroom');
```

### Update Job Status (Future)
```javascript
import { updateJob } from './src/data/jobStore';

await updateJob(jobId, { 
  status: 'Completed',
  completedDate: new Date().toISOString()
});
```

### Delete Job (Future)
```javascript
import { deleteJob } from './src/data/jobStore';

await deleteJob(jobId);
```

---

## API Quick Reference

### jobStore Functions

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `saveJob(jobData)` | `Object` | `Promise<String>` | Save/update job |
| `getAllJobs()` | None | `Promise<Array>` | Get all jobs |

**Future Functions:**
| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `getJobById(id)` | `String` | `Promise<Object>` | Get single job |
| `updateJob(id, updates)` | `String, Object` | `Promise<Object>` | Update job |
| `deleteJob(id)` | `String` | `Promise<Boolean>` | Delete job |
| `searchJobs(query)` | `String` | `Promise<Array>` | Search jobs |

### Job Object Structure

```javascript
{
  id: "1730716800000",           // Auto-generated timestamp
  description: "Fix leaking tap", // Required
  status: "Lokalny"               // Default: 'Lokalny'
}
```

**Extended Structure (Future):**
```javascript
{
  id: string,
  description: string,
  status: 'Lokalny' | 'In Progress' | 'Completed' | 'Cancelled',
  priority: 'low' | 'normal' | 'high' | 'urgent',
  category: string,
  clientName: string,
  clientPhone: string,
  address: string,
  estimatedHours: number,
  actualHours: number,
  cost: number,
  paid: boolean,
  scheduledDate: string,
  completedDate: string,
  notes: string,
  tags: string[],
  createdAt: string,
  updatedAt: string
}
```

---

## Component Quick Reference

### App Component

**Current:**
```jsx
import App from './App';

// No props (root component)
<App />
```

**Future Components:**

### JobForm
```jsx
import { JobForm } from './components/JobForm';

<JobForm onJobAdded={handleJobAdded} />
```

### JobList
```jsx
import { JobList } from './components/JobList';

<JobList 
  jobs={jobs}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
/>
```

### JobItem
```jsx
import { JobItem } from './components/JobItem';

<JobItem 
  job={job}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
/>
```

---

## PWA Features

### Check Service Worker Status
```javascript
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    console.log('Service workers:', registrations.length);
  });
```

### Check Online Status
```javascript
console.log('Online:', navigator.onLine);

window.addEventListener('online', () => {
  console.log('Back online!');
});

window.addEventListener('offline', () => {
  console.log('Gone offline!');
});
```

### Check Storage Usage
```javascript
navigator.storage.estimate().then(estimate => {
  const used = (estimate.usage / 1024 / 1024).toFixed(2);
  const quota = (estimate.quota / 1024 / 1024).toFixed(2);
  console.log(`Using ${used} MB of ${quota} MB`);
});
```

### Install Prompt (Future)
```javascript
import { promptInstall } from './utils/installPrompt';

// Trigger install prompt
const installed = await promptInstall();
```

---

## Troubleshooting

### Jobs Not Saving

**Check IndexedDB support:**
```javascript
if (!window.indexedDB) {
  console.error('IndexedDB not supported');
}
```

**Check storage quota:**
```javascript
navigator.storage.estimate().then(estimate => {
  if (estimate.usage >= estimate.quota * 0.9) {
    console.warn('Storage almost full');
  }
});
```

### Service Worker Issues

**Check registration:**
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    console.log('Service Worker ready:', registration);
  });
}
```

**Unregister service worker:**
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

### Clear All Data

**Clear IndexedDB:**
```javascript
import localforage from 'localforage';

localforage.clear().then(() => {
  console.log('IndexedDB cleared');
});
```

**Clear everything:**
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
await indexedDB.databases().then(dbs => {
  dbs.forEach(db => indexedDB.deleteDatabase(db.name));
});
```

---

## Keyboard Shortcuts

### Current
No keyboard shortcuts implemented yet.

### Future Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New job |
| `Ctrl/Cmd + F` | Search jobs |
| `Ctrl/Cmd + S` | Save job |
| `Esc` | Close dialog |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `/` | Focus search |

---

## Environment Variables

### Development
```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Fachowiec PWA (Dev)
VITE_DEBUG=true
```

### Production
```bash
# .env.production
VITE_API_URL=https://api.fachowiec.pl
VITE_APP_NAME=Fachowiec PWA
VITE_DEBUG=false
```

### Usage
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

---

## Browser DevTools

### Useful DevTools Panels

**Application Tab:**
- Service Workers
- IndexedDB → FachowiecPWA → zlecenia
- Storage → estimate quota
- Manifest

**Network Tab:**
- Throttling → Offline mode
- Disable cache
- Filter by type

**Console:**
```javascript
// Access IndexedDB
const db = await indexedDB.open('FachowiecPWA');

// Check service worker
await navigator.serviceWorker.ready;

// Storage info
await navigator.storage.estimate();
```

---

## Common Patterns

### Async/Await Error Handling
```javascript
try {
  const jobs = await getAllJobs();
  console.log('Jobs loaded:', jobs.length);
} catch (error) {
  console.error('Failed to load jobs:', error);
  // Show error to user
}
```

### Component State Management
```javascript
import { useState, useEffect } from 'react';

function MyComponent() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getAllJobs();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>Jobs: {jobs.length}</div>;
}
```

### Form Handling
```javascript
const [formData, setFormData] = useState({ description: '' });

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    await saveJob(formData);
    setFormData({ description: '' });
    // Success feedback
  } catch (error) {
    // Error feedback
  }
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
```

---

## File Locations

### Source Files
```
src/
  App.jsx              - Main component
  main.jsx             - Entry point
  data/jobStore.js     - Data layer
  App.css              - Styles
  index.css            - Global styles
```

### Configuration
```
vite.config.js       - Vite & PWA config
package.json         - Dependencies
eslint.config.js     - Linting rules
```

### Documentation
```
README.md                - Main readme
API_DOCUMENTATION.md     - API reference
COMPONENTS_GUIDE.md      - Component guide
USAGE_EXAMPLES.md        - Usage examples
CONTRIBUTING.md          - Contribution guide
ROADMAP.md              - Feature roadmap
CHANGELOG.md            - Version history
QUICK_REFERENCE.md      - This file
```

---

## External Resources

### Documentation
- [React Docs](https://react.dev/)
- [Vite Docs](https://vite.dev/)
- [LocalForage Docs](https://localforage.github.io/localForage/)
- [PWA Docs](https://web.dev/progressive-web-apps/)

### Tools
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [PWA Builder](https://www.pwabuilder.com/) - PWA testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditing

---

## Quick Tips

### Performance
- Use `useMemo` for expensive calculations
- Use `useCallback` for function props
- Lazy load components with `React.lazy()`
- Optimize images before adding to project

### PWA
- Test offline mode in DevTools
- Check service worker updates regularly
- Monitor storage usage
- Test install prompt on mobile

### Development
- Use React DevTools extension
- Enable source maps in development
- Keep dependencies updated
- Write clear commit messages

### Debugging
- Check browser console for errors
- Use React DevTools for component inspection
- Verify IndexedDB in Application tab
- Test in multiple browsers

---

**Last Updated:** 2025-11-04  
**Version:** 1.0.0

**See Also:**
- [Full API Documentation](./API_DOCUMENTATION.md)
- [Detailed Examples](./USAGE_EXAMPLES.md)
- [Component Guide](./COMPONENTS_GUIDE.md)
