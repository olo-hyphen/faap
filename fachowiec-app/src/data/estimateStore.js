import localforage from 'localforage';

// IndexedDB store for estimates
const estimateStore = localforage.createInstance({
  name: 'FachowiecPWA',
  storeName: 'estimates',
  description: 'Estimates and quotes'
});

// Save estimate
export async function saveEstimate(estimate) {
  const id = estimate.id || Date.now().toString();
  const estimateData = {
    ...estimate,
    id,
    createdAt: estimate.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await estimateStore.setItem(id, estimateData);
  return id;
}

// Get all estimates
export async function getAllEstimates() {
  const estimates = [];
  await estimateStore.iterate((value) => {
    estimates.push(value);
  });
  return estimates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get estimate by ID
export async function getEstimateById(id) {
  return await estimateStore.getItem(id);
}

// Update estimate
export async function updateEstimate(id, updates) {
  const estimate = await estimateStore.getItem(id);
  if (estimate) {
    const updated = {
      ...estimate,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await estimateStore.setItem(id, updated);
    return updated;
  }
  return null;
}

// Delete estimate
export async function deleteEstimate(id) {
  await estimateStore.removeItem(id);
}

// Get estimates by status
export async function getEstimatesByStatus(status) {
  const estimates = [];
  await estimateStore.iterate((value) => {
    if (value.status === status) {
      estimates.push(value);
    }
  });
  return estimates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get estimates by client
export async function getEstimatesByClient(clientId) {
  const estimates = [];
  await estimateStore.iterate((value) => {
    if (value.clientId === clientId) {
      estimates.push(value);
    }
  });
  return estimates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Convert estimate to job
export async function convertEstimateToJob(estimateId) {
  const estimate = await getEstimateById(estimateId);
  if (!estimate) {
    throw new Error('Estimate not found');
  }

  // Import jobStore functions
  const { saveJob } = await import('./jobStore');
  
  const job = {
    title: estimate.title || `Zlecenie z oferty #${estimate.id}`,
    description: estimate.description || '',
    clientId: estimate.clientId,
    clientName: estimate.clientName,
    status: 'Zaplanowane',
    priority: 'Średni',
    scheduledDate: estimate.dueDate || new Date().toISOString().split('T')[0],
    estimatedPrice: estimate.total,
    estimateId: estimate.id,
  };

  const jobId = await saveJob(job);
  
  // Update estimate status
  await updateEstimate(estimateId, { 
    status: 'accepted',
    jobId,
    convertedAt: new Date().toISOString(),
  });

  return jobId;
}
