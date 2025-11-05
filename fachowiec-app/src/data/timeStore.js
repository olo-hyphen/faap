import localforage from 'localforage';

// IndexedDB store for time tracking
const timeStore = localforage.createInstance({
  name: 'FachowiecPWA',
  storeName: 'timeTracking',
  description: 'Time tracking entries'
});

// Save time entry
export async function saveTimeEntry(entry) {
  const id = entry.id || Date.now().toString();
  const timeEntry = {
    ...entry,
    id,
    createdAt: entry.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await timeStore.setItem(id, timeEntry);
  return id;
}

// Get all time entries
export async function getAllTimeEntries() {
  const entries = [];
  await timeStore.iterate((value) => {
    entries.push(value);
  });
  return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get time entries by job ID
export async function getTimeEntriesByJobId(jobId) {
  const entries = [];
  await timeStore.iterate((value) => {
    if (value.jobId === jobId) {
      entries.push(value);
    }
  });
  return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get time entry by ID
export async function getTimeEntryById(id) {
  return await timeStore.getItem(id);
}

// Update time entry
export async function updateTimeEntry(id, updates) {
  const entry = await timeStore.getItem(id);
  if (entry) {
    const updated = {
      ...entry,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await timeStore.setItem(id, updated);
    return updated;
  }
  return null;
}

// Delete time entry
export async function deleteTimeEntry(id) {
  await timeStore.removeItem(id);
}

// Get active timer (if any)
export async function getActiveTimer() {
  const entries = await getAllTimeEntries();
  return entries.find(entry => entry.isRunning);
}

// Stop all active timers
export async function stopAllActiveTimers() {
  const entries = await getAllTimeEntries();
  const activeEntries = entries.filter(entry => entry.isRunning);
  for (const entry of activeEntries) {
    await updateTimeEntry(entry.id, { isRunning: false });
  }
}
