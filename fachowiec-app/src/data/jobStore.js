import localforage from 'localforage';

// IndexedDB store for jobs
const jobStore = localforage.createInstance({
  name: 'FachowiecPWA',
  storeName: 'jobs',
  description: 'Jobs and tasks'
});

// Save job
export async function saveJob(jobData) {
  const id = jobData.id || Date.now().toString();
  const job = {
    ...jobData,
    id,
    createdAt: jobData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await jobStore.setItem(id, job);
  return id;
}

// Get all jobs
export async function getAllJobs() {
  const jobs = [];
  await jobStore.iterate((value) => {
    jobs.push(value);
  });
  return jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get job by ID
export async function getJobById(id) {
  return await jobStore.getItem(id);
}

// Update job
export async function updateJob(id, updates) {
  const job = await jobStore.getItem(id);
  if (job) {
    const updated = {
      ...job,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await jobStore.setItem(id, updated);
    return updated;
  }
  return null;
}

// Delete job
export async function deleteJob(id) {
  await jobStore.removeItem(id);
}
