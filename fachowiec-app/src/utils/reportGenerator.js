import { getAllTimeEntries } from '../data/timeStore';

/**
 * Generate daily report
 * @param {Date} date - Date for the report
 * @returns {Promise<Object>} Report data
 */
export async function generateDailyReport(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const timeEntries = await getAllTimeEntries();
  const dayEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.startTime);
    return entryDate >= startOfDay && entryDate <= endOfDay && !entry.isRunning;
  });

  const totalSeconds = dayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const totalHours = totalSeconds / 3600;
  const jobCount = new Set(dayEntries.map(e => e.jobId)).size;

  return {
    type: 'daily',
    date: date.toISOString().split('T')[0],
    totalHours: totalHours.toFixed(2),
    totalSeconds,
    jobCount,
    entries: dayEntries,
    entryCount: dayEntries.length,
  };
}

/**
 * Generate weekly report
 * @param {Date} startDate - Start date of the week
 * @returns {Promise<Object>} Report data
 */
export async function generateWeeklyReport(startDate) {
  const weekStart = new Date(startDate);
  weekStart.setHours(0, 0, 0, 0);
  // Set to Monday
  const dayOfWeek = weekStart.getDay();
  const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  weekStart.setDate(diff);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const timeEntries = await getAllTimeEntries();
  const weekEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.startTime);
    return entryDate >= weekStart && entryDate <= weekEnd && !entry.isRunning;
  });

  const totalSeconds = weekEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const totalHours = totalSeconds / 3600;
  const jobCount = new Set(weekEntries.map(e => e.jobId)).size;

  // Group by day
  const dailyBreakdown = {};
  weekEntries.forEach(entry => {
    const entryDate = new Date(entry.startTime);
    const dateKey = entryDate.toISOString().split('T')[0];
    if (!dailyBreakdown[dateKey]) {
      dailyBreakdown[dateKey] = { seconds: 0, count: 0 };
    }
    dailyBreakdown[dateKey].seconds += entry.duration || 0;
    dailyBreakdown[dateKey].count += 1;
  });

  return {
    type: 'weekly',
    startDate: weekStart.toISOString().split('T')[0],
    endDate: weekEnd.toISOString().split('T')[0],
    totalHours: totalHours.toFixed(2),
    totalSeconds,
    jobCount,
    entries: weekEntries,
    entryCount: weekEntries.length,
    dailyBreakdown,
  };
}

/**
 * Generate monthly report
 * @param {Date} date - Any date in the month
 * @returns {Promise<Object>} Report data
 */
export async function generateMonthlyReport(date) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  const timeEntries = await getAllTimeEntries();
  const monthEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.startTime);
    return entryDate >= monthStart && entryDate <= monthEnd && !entry.isRunning;
  });

  const totalSeconds = monthEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const totalHours = totalSeconds / 3600;
  const jobCount = new Set(monthEntries.map(e => e.jobId)).size;

  // Group by week
  const weeklyBreakdown = {};
  monthEntries.forEach(entry => {
    const entryDate = new Date(entry.startTime);
    const weekStart = new Date(entryDate);
    const dayOfWeek = weekStart.getDay();
    const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklyBreakdown[weekKey]) {
      weeklyBreakdown[weekKey] = { seconds: 0, count: 0 };
    }
    weeklyBreakdown[weekKey].seconds += entry.duration || 0;
    weeklyBreakdown[weekKey].count += 1;
  });

  return {
    type: 'monthly',
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    startDate: monthStart.toISOString().split('T')[0],
    endDate: monthEnd.toISOString().split('T')[0],
    totalHours: totalHours.toFixed(2),
    totalSeconds,
    jobCount,
    entries: monthEntries,
    entryCount: monthEntries.length,
    weeklyBreakdown,
  };
}

/**
 * Generate yearly report
 * @param {Date} date - Any date in the year
 * @returns {Promise<Object>} Report data
 */
export async function generateYearlyReport(date) {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  yearStart.setHours(0, 0, 0, 0);
  const yearEnd = new Date(date.getFullYear(), 11, 31);
  yearEnd.setHours(23, 59, 59, 999);

  const timeEntries = await getAllTimeEntries();
  const yearEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.startTime);
    return entryDate >= yearStart && entryDate <= yearEnd && !entry.isRunning;
  });

  const totalSeconds = yearEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const totalHours = totalSeconds / 3600;
  const jobCount = new Set(yearEntries.map(e => e.jobId)).size;

  // Group by month
  const monthlyBreakdown = {};
  yearEntries.forEach(entry => {
    const entryDate = new Date(entry.startTime);
    const monthKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyBreakdown[monthKey]) {
      monthlyBreakdown[monthKey] = { seconds: 0, count: 0 };
    }
    monthlyBreakdown[monthKey].seconds += entry.duration || 0;
    monthlyBreakdown[monthKey].count += 1;
  });

  return {
    type: 'yearly',
    year: date.getFullYear(),
    startDate: yearStart.toISOString().split('T')[0],
    endDate: yearEnd.toISOString().split('T')[0],
    totalHours: totalHours.toFixed(2),
    totalSeconds,
    jobCount,
    entries: yearEntries,
    entryCount: yearEntries.length,
    monthlyBreakdown,
  };
}

/**
 * Generate report based on type
 * @param {string} type - 'daily', 'weekly', 'monthly', 'yearly'
 * @param {Date} date - Date for the report
 * @returns {Promise<Object>} Report data
 */
export async function generateReport(type, date = new Date()) {
  switch (type) {
    case 'daily':
      return await generateDailyReport(date);
    case 'weekly':
      return await generateWeeklyReport(date);
    case 'monthly':
      return await generateMonthlyReport(date);
    case 'yearly':
      return await generateYearlyReport(date);
    default:
      throw new Error(`Unknown report type: ${type}`);
  }
}
