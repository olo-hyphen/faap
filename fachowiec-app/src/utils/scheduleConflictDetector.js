/**
 * Detects schedule conflicts between jobs
 * @param {Array} jobs - Array of job objects with scheduledDate and scheduledTime
 * @param {Object} newJob - New job to check for conflicts
 * @returns {Array} Array of conflicting jobs
 */
export function detectScheduleConflicts(jobs, newJob) {
  if (!newJob.scheduledDate) {
    return [];
  }

  const newDate = new Date(newJob.scheduledDate);
  const conflicts = [];

  jobs.forEach(job => {
    // Skip if it's the same job
    if (job.id === newJob.id) {
      return;
    }

    // Skip if job doesn't have a scheduled date
    if (!job.scheduledDate) {
      return;
    }

    const jobDate = new Date(job.scheduledDate);

    // Check if same day
    if (
      newDate.getFullYear() === jobDate.getFullYear() &&
      newDate.getMonth() === jobDate.getMonth() &&
      newDate.getDate() === jobDate.getDate()
    ) {
      // If both have times, check for time overlap
      if (newJob.scheduledTime && job.scheduledTime) {
        const newTime = parseTime(newJob.scheduledTime);
        const jobTime = parseTime(job.scheduledTime);
        const newDuration = newJob.estimatedDuration || 60; // default 60 minutes
        const jobDuration = job.estimatedDuration || 60;

        // Check if times overlap
        if (isTimeOverlapping(newTime, newDuration, jobTime, jobDuration)) {
          conflicts.push(job);
        }
      } else {
        // Same day without specific times - potential conflict
        conflicts.push(job);
      }
    }
  });

  return conflicts;
}

/**
 * Parse time string (HH:mm) to minutes since midnight
 * @param {string} timeStr - Time string in HH:mm format
 * @returns {number} Minutes since midnight
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if two time ranges overlap
 * @param {number} start1 - Start time of first job in minutes
 * @param {number} duration1 - Duration of first job in minutes
 * @param {number} start2 - Start time of second job in minutes
 * @param {number} duration2 - Duration of second job in minutes
 * @returns {boolean} True if time ranges overlap
 */
function isTimeOverlapping(start1, duration1, start2, duration2) {
  const end1 = start1 + duration1;
  const end2 = start2 + duration2;

  // Check if ranges overlap
  return (start1 < end2 && end1 > start2);
}

/**
 * Get conflicts for a specific date
 * @param {Array} jobs - Array of all jobs
 * @param {Date} date - Date to check
 * @returns {Array} Array of conflicting jobs for that date
 */
export function getConflictsForDate(jobs, date) {
  const dateStr = date.toISOString().split('T')[0];
  const jobsOnDate = jobs.filter(job => {
    if (!job.scheduledDate) return false;
    const jobDate = new Date(job.scheduledDate);
    return jobDate.toISOString().split('T')[0] === dateStr;
  });

  const conflicts = [];
  for (let i = 0; i < jobsOnDate.length; i++) {
    for (let j = i + 1; j < jobsOnDate.length; j++) {
      const job1 = jobsOnDate[i];
      const job2 = jobsOnDate[j];

      if (job1.scheduledTime && job2.scheduledTime) {
        const time1 = parseTime(job1.scheduledTime);
        const time2 = parseTime(job2.scheduledTime);
        const duration1 = job1.estimatedDuration || 60;
        const duration2 = job2.estimatedDuration || 60;

        if (isTimeOverlapping(time1, duration1, time2, duration2)) {
          if (!conflicts.find(c => c.id === job1.id)) {
            conflicts.push(job1);
          }
          if (!conflicts.find(c => c.id === job2.id)) {
            conflicts.push(job2);
          }
        }
      }
    }
  }

  return conflicts;
}
