# Fachowiec PWA - Usage Examples

## Table of Contents
- [Getting Started](#getting-started)
- [Basic Usage](#basic-usage)
- [Advanced Examples](#advanced-examples)
- [Integration Examples](#integration-examples)
- [Real-World Scenarios](#real-world-scenarios)

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pwa-fachowiec.git

# Navigate to project
cd pwa-fachowiec

# Install dependencies
npm install

# Start development server
npm run dev
```

### First Run

1. Open browser to `http://localhost:5173`
2. You'll see the main application interface
3. Try adding your first job:
   - Enter "Install kitchen sink" in the input field
   - Click "Dodaj Zlecenie"
   - Job appears in the list below

---

## Basic Usage

### Example 1: Add a Simple Job

```javascript
// Manual test in browser console
import { saveJob } from './src/data/jobStore';

// Add a basic job
const jobId = await saveJob({
  description: "Fix leaking tap in bathroom",
  status: "Lokalny"
});

console.log('Job created with ID:', jobId);
```

**In UI:**
1. Type job description: "Fix leaking tap in bathroom"
2. Press Enter or click "Dodaj Zlecenie"
3. Job appears in list with status "Lokalny"

### Example 2: View All Jobs

```javascript
// Browser console
import { getAllJobs } from './src/data/jobStore';

const jobs = await getAllJobs();
console.table(jobs);

// Output:
// ┌─────────┬──────────────┬─────────────────────────────┬──────────┐
// │ (index) │      id      │        description          │  status  │
// ├─────────┼──────────────┼─────────────────────────────┼──────────┤
// │    0    │ '1699123456' │ 'Fix leaking tap'           │ 'Lokalny'│
// │    1    │ '1699123789' │ 'Install kitchen sink'      │ 'Lokalny'│
// └─────────┴──────────────┴─────────────────────────────┴──────────┘
```

### Example 3: Working Offline

**Test offline functionality:**

1. Open DevTools (F12)
2. Go to Network tab
3. Set to "Offline"
4. Try adding a new job
5. Job still saves to IndexedDB
6. Go back "Online"
7. Jobs persist and are ready to sync

```javascript
// Test offline detection
window.addEventListener('offline', () => {
  console.log('You are offline - jobs will be saved locally');
});

window.addEventListener('online', () => {
  console.log('You are online - ready to sync jobs');
});
```

---

## Advanced Examples

### Example 4: Extended Job with Custom Fields

```javascript
// src/data/jobStore.js - Extended save function
export async function saveJobExtended(jobData) {
  const id = jobData.id || Date.now().toString();
  
  const job = {
    id,
    description: jobData.description,
    status: jobData.status || 'Lokalny',
    priority: jobData.priority || 'normal', // low, normal, high, urgent
    category: jobData.category || 'general', // plumbing, electrical, etc.
    estimatedHours: jobData.estimatedHours || 0,
    actualHours: jobData.actualHours || 0,
    clientName: jobData.clientName || '',
    clientPhone: jobData.clientPhone || '',
    address: jobData.address || '',
    notes: jobData.notes || '',
    scheduledDate: jobData.scheduledDate || null,
    completedDate: jobData.completedDate || null,
    cost: jobData.cost || 0,
    paid: jobData.paid || false,
    createdAt: jobData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: jobData.tags || [],
    photos: jobData.photos || [],
  };
  
  await jobStore.setItem(id, job);
  return id;
}

// Usage:
const jobId = await saveJobExtended({
  description: "Complete bathroom renovation",
  priority: "high",
  category: "plumbing",
  clientName: "Jan Kowalski",
  clientPhone: "+48 123 456 789",
  address: "ul. Przykładowa 12, Warszawa",
  estimatedHours: 40,
  cost: 5000,
  scheduledDate: "2025-11-10",
  tags: ["renovation", "bathroom", "urgent"],
  notes: "Client wants modern fixtures, white and gray color scheme"
});
```

### Example 5: Job Statistics Dashboard

```javascript
// src/utils/statistics.js
import { getAllJobs } from '../data/jobStore';

export async function getJobStatistics() {
  const jobs = await getAllJobs();
  
  const stats = {
    total: jobs.length,
    byStatus: {},
    byPriority: {},
    byCategory: {},
    totalCost: 0,
    totalPaid: 0,
    totalHours: 0,
    averageJobValue: 0,
    completionRate: 0,
  };
  
  jobs.forEach(job => {
    // Count by status
    stats.byStatus[job.status] = (stats.byStatus[job.status] || 0) + 1;
    
    // Count by priority
    if (job.priority) {
      stats.byPriority[job.priority] = (stats.byPriority[job.priority] || 0) + 1;
    }
    
    // Count by category
    if (job.category) {
      stats.byCategory[job.category] = (stats.byCategory[job.category] || 0) + 1;
    }
    
    // Financial stats
    stats.totalCost += job.cost || 0;
    if (job.paid) {
      stats.totalPaid += job.cost || 0;
    }
    
    // Time stats
    stats.totalHours += job.actualHours || 0;
  });
  
  stats.averageJobValue = stats.total > 0 ? stats.totalCost / stats.total : 0;
  stats.completionRate = stats.total > 0 
    ? (stats.byStatus['Completed'] || 0) / stats.total * 100 
    : 0;
  
  return stats;
}

// Usage:
const stats = await getJobStatistics();
console.log('Job Statistics:', stats);

// Output:
// {
//   total: 25,
//   byStatus: { Lokalny: 10, 'In Progress': 8, Completed: 7 },
//   byPriority: { normal: 15, high: 7, urgent: 3 },
//   byCategory: { plumbing: 10, electrical: 8, general: 7 },
//   totalCost: 50000,
//   totalPaid: 35000,
//   totalHours: 250,
//   averageJobValue: 2000,
//   completionRate: 28
// }
```

### Example 6: Job Search and Filter

```javascript
// src/utils/search.js
import { getAllJobs } from '../data/jobStore';

export async function searchJobs(criteria) {
  const allJobs = await getAllJobs();
  
  return allJobs.filter(job => {
    // Text search in description
    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      const matchesDescription = job.description.toLowerCase().includes(query);
      const matchesNotes = job.notes?.toLowerCase().includes(query);
      const matchesClient = job.clientName?.toLowerCase().includes(query);
      
      if (!matchesDescription && !matchesNotes && !matchesClient) {
        return false;
      }
    }
    
    // Filter by status
    if (criteria.status && criteria.status !== 'all') {
      if (job.status !== criteria.status) return false;
    }
    
    // Filter by priority
    if (criteria.priority && criteria.priority !== 'all') {
      if (job.priority !== criteria.priority) return false;
    }
    
    // Filter by category
    if (criteria.category && criteria.category !== 'all') {
      if (job.category !== criteria.category) return false;
    }
    
    // Filter by date range
    if (criteria.dateFrom) {
      const jobDate = new Date(job.createdAt);
      const fromDate = new Date(criteria.dateFrom);
      if (jobDate < fromDate) return false;
    }
    
    if (criteria.dateTo) {
      const jobDate = new Date(job.createdAt);
      const toDate = new Date(criteria.dateTo);
      if (jobDate > toDate) return false;
    }
    
    // Filter by tags
    if (criteria.tags && criteria.tags.length > 0) {
      const hasTags = criteria.tags.some(tag => 
        job.tags?.includes(tag)
      );
      if (!hasTags) return false;
    }
    
    // Filter by cost range
    if (criteria.minCost !== undefined) {
      if ((job.cost || 0) < criteria.minCost) return false;
    }
    
    if (criteria.maxCost !== undefined) {
      if ((job.cost || 0) > criteria.maxCost) return false;
    }
    
    // Filter by payment status
    if (criteria.paid !== undefined) {
      if (job.paid !== criteria.paid) return false;
    }
    
    return true;
  });
}

// Usage examples:

// 1. Simple text search
const results = await searchJobs({ 
  query: 'bathroom' 
});

// 2. Filter by status
const inProgress = await searchJobs({ 
  status: 'In Progress' 
});

// 3. Complex multi-criteria search
const complexSearch = await searchJobs({
  query: 'plumbing',
  status: 'In Progress',
  priority: 'high',
  category: 'plumbing',
  dateFrom: '2025-01-01',
  dateTo: '2025-12-31',
  minCost: 1000,
  maxCost: 5000,
  paid: false,
  tags: ['urgent', 'renovation']
});

console.log(`Found ${complexSearch.length} matching jobs`);
```

### Example 7: Bulk Operations

```javascript
// src/utils/bulkOperations.js
import { getAllJobs, updateJob, deleteJob } from '../data/jobStore';

// Update multiple jobs at once
export async function bulkUpdateJobs(jobIds, updates) {
  const results = [];
  
  for (const id of jobIds) {
    try {
      const updated = await updateJob(id, updates);
      results.push({ id, success: true, job: updated });
    } catch (error) {
      results.push({ id, success: false, error: error.message });
    }
  }
  
  return results;
}

// Delete multiple jobs
export async function bulkDeleteJobs(jobIds) {
  const results = [];
  
  for (const id of jobIds) {
    try {
      await deleteJob(id);
      results.push({ id, success: true });
    } catch (error) {
      results.push({ id, success: false, error: error.message });
    }
  }
  
  return results;
}

// Archive old completed jobs
export async function archiveCompletedJobs(daysOld = 90) {
  const jobs = await getAllJobs();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const toArchive = jobs.filter(job => 
    job.status === 'Completed' &&
    new Date(job.completedDate || job.updatedAt) < cutoffDate
  );
  
  const jobIds = toArchive.map(job => job.id);
  const results = await bulkUpdateJobs(jobIds, { status: 'Archived' });
  
  const successful = results.filter(r => r.success).length;
  console.log(`Archived ${successful} of ${jobIds.length} old jobs`);
  
  return results;
}

// Usage:

// 1. Mark multiple jobs as completed
const completedIds = ['123', '456', '789'];
await bulkUpdateJobs(completedIds, { 
  status: 'Completed',
  completedDate: new Date().toISOString()
});

// 2. Delete test jobs
const testJobIds = await getAllJobs()
  .then(jobs => jobs.filter(j => j.tags?.includes('test')))
  .then(jobs => jobs.map(j => j.id));
await bulkDeleteJobs(testJobIds);

// 3. Archive old jobs
await archiveCompletedJobs(90); // Archive jobs completed 90+ days ago
```

---

## Integration Examples

### Example 8: Export Jobs to CSV

```javascript
// src/utils/export.js
import { getAllJobs } from '../data/jobStore';

export async function exportJobsToCSV() {
  const jobs = await getAllJobs();
  
  // CSV header
  const headers = [
    'ID',
    'Description',
    'Status',
    'Priority',
    'Category',
    'Client',
    'Phone',
    'Address',
    'Cost',
    'Paid',
    'Created',
    'Completed'
  ];
  
  // CSV rows
  const rows = jobs.map(job => [
    job.id,
    `"${job.description.replace(/"/g, '""')}"`, // Escape quotes
    job.status,
    job.priority || '',
    job.category || '',
    job.clientName || '',
    job.clientPhone || '',
    job.address || '',
    job.cost || 0,
    job.paid ? 'Yes' : 'No',
    job.createdAt || '',
    job.completedDate || ''
  ]);
  
  // Combine
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fachowiec-jobs-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  
  return csv;
}

// Usage:
// <button onClick={exportJobsToCSV}>Export to CSV</button>
```

### Example 9: Import Jobs from JSON

```javascript
// src/utils/import.js
import { saveJob } from '../data/jobStore';

export async function importJobsFromJSON(jsonString) {
  try {
    const jobs = JSON.parse(jsonString);
    
    if (!Array.isArray(jobs)) {
      throw new Error('JSON must be an array of jobs');
    }
    
    const results = [];
    
    for (const job of jobs) {
      try {
        // Validate required fields
        if (!job.description) {
          throw new Error('Description is required');
        }
        
        const jobId = await saveJob({
          ...job,
          // Don't import the ID, let system generate new ones
          id: undefined,
          // Mark as imported
          imported: true,
          importedAt: new Date().toISOString()
        });
        
        results.push({ success: true, jobId });
      } catch (error) {
        results.push({ 
          success: false, 
          error: error.message,
          job: job.description 
        });
      }
    }
    
    const successful = results.filter(r => r.success).length;
    console.log(`Imported ${successful} of ${jobs.length} jobs`);
    
    return results;
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}

// Usage:
async function handleFileUpload(event) {
  const file = event.target.files[0];
  const text = await file.text();
  const results = await importJobsFromJSON(text);
  
  alert(`Imported ${results.filter(r => r.success).length} jobs`);
}

// <input type="file" accept=".json" onChange={handleFileUpload} />
```

### Example 10: Sync with Backend API

```javascript
// src/utils/apiSync.js
import { getAllJobs, updateJob, saveJob } from '../data/jobStore';

const API_URL = 'https://api.fachowiec.pl';

export async function syncWithServer() {
  if (!navigator.onLine) {
    throw new Error('Cannot sync while offline');
  }
  
  const localJobs = await getAllJobs();
  const syncResults = {
    uploaded: 0,
    downloaded: 0,
    conflicts: 0,
    errors: []
  };
  
  try {
    // 1. Upload local jobs to server
    const localOnlyJobs = localJobs.filter(job => 
      job.status === 'Lokalny' && !job.serverId
    );
    
    if (localOnlyJobs.length > 0) {
      const response = await fetch(`${API_URL}/jobs/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(localOnlyJobs)
      });
      
      if (response.ok) {
        const serverJobs = await response.json();
        
        // Update local jobs with server IDs
        for (let i = 0; i < localOnlyJobs.length; i++) {
          await updateJob(localOnlyJobs[i].id, {
            serverId: serverJobs[i].id,
            status: 'Synced',
            syncedAt: new Date().toISOString()
          });
        }
        
        syncResults.uploaded = localOnlyJobs.length;
      }
    }
    
    // 2. Download new jobs from server
    const lastSync = localStorage.getItem('lastSyncTime') || 
                     new Date(0).toISOString();
    
    const downloadResponse = await fetch(
      `${API_URL}/jobs?since=${lastSync}`,
      {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      }
    );
    
    if (downloadResponse.ok) {
      const serverJobs = await downloadResponse.json();
      
      for (const serverJob of serverJobs) {
        // Check if we have this job locally
        const localJob = localJobs.find(j => j.serverId === serverJob.id);
        
        if (!localJob) {
          // New job from server
          await saveJob({
            ...serverJob,
            serverId: serverJob.id,
            status: 'Synced'
          });
          syncResults.downloaded++;
        } else {
          // Check for conflicts
          const localUpdated = new Date(localJob.updatedAt);
          const serverUpdated = new Date(serverJob.updatedAt);
          
          if (serverUpdated > localUpdated) {
            // Server version is newer
            await updateJob(localJob.id, {
              ...serverJob,
              serverId: serverJob.id,
              status: 'Synced'
            });
            syncResults.downloaded++;
          } else if (localUpdated > serverUpdated) {
            // Local version is newer - upload
            await fetch(`${API_URL}/jobs/${serverJob.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
              },
              body: JSON.stringify(localJob)
            });
            syncResults.uploaded++;
          }
          // If timestamps equal, no action needed
        }
      }
    }
    
    // 3. Save last sync time
    localStorage.setItem('lastSyncTime', new Date().toISOString());
    
    return syncResults;
    
  } catch (error) {
    syncResults.errors.push(error.message);
    throw error;
  }
}

function getAuthToken() {
  return localStorage.getItem('authToken') || '';
}

// Usage:
async function handleSyncClick() {
  try {
    const results = await syncWithServer();
    alert(`Sync complete! 
      Uploaded: ${results.uploaded}
      Downloaded: ${results.downloaded}
    `);
  } catch (error) {
    alert(`Sync failed: ${error.message}`);
  }
}

// <button onClick={handleSyncClick}>Sync with Server</button>

// Auto-sync when online
window.addEventListener('online', () => {
  console.log('Back online - starting sync...');
  syncWithServer().catch(console.error);
});
```

---

## Real-World Scenarios

### Scenario 1: Daily Workflow for a Plumber

```javascript
// Morning: Check scheduled jobs for today
import { searchJobs } from './utils/search';

const today = new Date().toISOString().split('T')[0];
const todaysJobs = await searchJobs({
  scheduledDate: today,
  status: 'In Progress'
});

console.log(`You have ${todaysJobs.length} jobs scheduled for today`);

// Start first job
import { updateJob } from './data/jobStore';

const firstJob = todaysJobs[0];
await updateJob(firstJob.id, {
  status: 'In Progress',
  startedAt: new Date().toISOString()
});

// Log time spent (after completing job)
await updateJob(firstJob.id, {
  status: 'Completed',
  completedDate: new Date().toISOString(),
  actualHours: 3.5,
  notes: 'Replaced old pipes, installed new fixtures. Client satisfied.'
});

// Mark as paid
await updateJob(firstJob.id, {
  paid: true,
  paymentDate: new Date().toISOString(),
  paymentMethod: 'cash'
});

// End of day: Generate daily report
import { getJobStatistics } from './utils/statistics';

const stats = await getJobStatistics();
const completed = await searchJobs({
  completedDate: today,
  status: 'Completed'
});

console.log(`Daily Report for ${today}:
  Jobs completed: ${completed.length}
  Total hours: ${completed.reduce((sum, j) => sum + (j.actualHours || 0), 0)}
  Total earned: ${completed.reduce((sum, j) => sum + (j.cost || 0), 0)} PLN
  Paid: ${completed.filter(j => j.paid).length}
`);
```

### Scenario 2: Emergency Repair Workflow

```javascript
// Client calls about urgent leak
import { saveJob } from './data/jobStore';
import { showNotification } from './utils/notifications';

const urgentJob = await saveJob({
  description: 'Emergency: Water leak in basement',
  status: 'In Progress',
  priority: 'urgent',
  category: 'plumbing',
  clientName: 'Maria Nowak',
  clientPhone: '+48 555 123 456',
  address: 'ul. Kwiatowa 5, Kraków',
  scheduledDate: new Date().toISOString(), // Right now
  estimatedHours: 2,
  cost: 500,
  notes: 'Client says water is flooding the basement. Bring pump.',
  tags: ['emergency', 'leak', 'basement']
});

// Send notification
await showNotification('Urgent Job Added', {
  body: 'Emergency leak at ul. Kwiatowa 5',
  tag: 'urgent-job',
  requireInteraction: true
});

// Navigate with Google Maps
const address = encodeURIComponent('ul. Kwiatowa 5, Kraków');
window.open(`https://www.google.com/maps/search/?api=1&query=${address}`);

// During repair: Add photos
import { savePhoto } from './data/photoStore';

await savePhoto({
  jobId: urgentJob,
  type: 'before',
  caption: 'Flooded basement before repairs',
  file: photoBlob
});

await savePhoto({
  jobId: urgentJob,
  type: 'problem',
  caption: 'Cracked pipe causing leak',
  file: problemPhotoBlob
});

await savePhoto({
  jobId: urgentJob,
  type: 'solution',
  caption: 'New pipe installed',
  file: solutionPhotoBlob
});

await savePhoto({
  jobId: urgentJob,
  type: 'after',
  caption: 'Basement dried, repairs complete',
  file: afterPhotoBlob
});

// Complete job
await updateJob(urgentJob, {
  status: 'Completed',
  completedDate: new Date().toISOString(),
  actualHours: 2.5,
  cost: 600, // Higher due to emergency
  notes: 'Replaced cracked pipe, pumped water, client happy with quick response'
});
```

### Scenario 3: Weekly Planning

```javascript
// src/utils/planning.js
import { getAllJobs, updateJob } from '../data/jobStore';

export async function generateWeeklyPlan() {
  const jobs = await getAllJobs();
  
  // Get all pending and in-progress jobs
  const activeJobs = jobs.filter(job => 
    job.status === 'Lokalny' || job.status === 'In Progress'
  );
  
  // Sort by priority and estimated hours
  const sorted = activeJobs.sort((a, b) => {
    // Priority weight
    const priorityWeight = {
      urgent: 4,
      high: 3,
      normal: 2,
      low: 1
    };
    
    const aPriority = priorityWeight[a.priority] || 2;
    const bPriority = priorityWeight[b.priority] || 2;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // If same priority, schedule faster jobs first
    return (a.estimatedHours || 0) - (b.estimatedHours || 0);
  });
  
  // Schedule jobs across the week
  const weekPlan = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: []
  };
  
  const days = Object.keys(weekPlan);
  const maxHoursPerDay = 8;
  let currentDay = 0;
  let currentDayHours = 0;
  
  for (const job of sorted) {
    const jobHours = job.estimatedHours || 2;
    
    // Move to next day if needed
    if (currentDayHours + jobHours > maxHoursPerDay) {
      currentDay++;
      currentDayHours = 0;
    }
    
    // Skip if we've exceeded the week
    if (currentDay >= days.length) break;
    
    // Calculate scheduled date
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + currentDay);
    
    // Update job with scheduled date
    await updateJob(job.id, {
      scheduledDate: scheduledDate.toISOString()
    });
    
    weekPlan[days[currentDay]].push({
      ...job,
      scheduledDate: scheduledDate.toISOString()
    });
    
    currentDayHours += jobHours;
  }
  
  return weekPlan;
}

// Usage:
const plan = await generateWeeklyPlan();

console.log('Weekly Plan:');
Object.entries(plan).forEach(([day, jobs]) => {
  console.log(`\n${day}:`);
  jobs.forEach(job => {
    console.log(`  - ${job.description} (${job.estimatedHours}h, ${job.priority})`);
  });
  const totalHours = jobs.reduce((sum, j) => sum + (j.estimatedHours || 0), 0);
  console.log(`  Total: ${totalHours} hours`);
});
```

---

## Advanced Patterns

### Pattern 1: Undo/Redo Functionality

```javascript
// src/utils/history.js
class JobHistory {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }
  
  addAction(action, jobData) {
    // Remove any actions after current index
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Add new action
    this.history.push({ action, jobData, timestamp: Date.now() });
    this.currentIndex++;
    
    // Limit history size
    if (this.history.length > 50) {
      this.history.shift();
      this.currentIndex--;
    }
  }
  
  canUndo() {
    return this.currentIndex >= 0;
  }
  
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
  
  async undo() {
    if (!this.canUndo()) return;
    
    const entry = this.history[this.currentIndex];
    
    switch (entry.action) {
      case 'create':
        await deleteJob(entry.jobData.id);
        break;
      case 'update':
        await updateJob(entry.jobData.id, entry.jobData.oldData);
        break;
      case 'delete':
        await saveJob(entry.jobData);
        break;
    }
    
    this.currentIndex--;
  }
  
  async redo() {
    if (!this.canRedo()) return;
    
    this.currentIndex++;
    const entry = this.history[this.currentIndex];
    
    switch (entry.action) {
      case 'create':
        await saveJob(entry.jobData);
        break;
      case 'update':
        await updateJob(entry.jobData.id, entry.jobData.newData);
        break;
      case 'delete':
        await deleteJob(entry.jobData.id);
        break;
    }
  }
}

export const jobHistory = new JobHistory();

// Usage with keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') {
    jobHistory.undo();
  }
  if (e.ctrlKey && e.key === 'y') {
    jobHistory.redo();
  }
});
```

---

**Last Updated:** 2025-11-04  
**Version:** 1.0.0
