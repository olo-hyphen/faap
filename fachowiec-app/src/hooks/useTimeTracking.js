import { useState, useEffect, useCallback } from 'react';
import { saveTimeEntry, updateTimeEntry, getActiveTimer, stopAllActiveTimers } from '../data/timeStore';

export function useTimeTracking(jobId) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [currentEntryId, setCurrentEntryId] = useState(null);

  // Load active timer on mount
  useEffect(() => {
    const loadActiveTimer = async () => {
      const activeTimer = await getActiveTimer();
      if (activeTimer && activeTimer.jobId === jobId) {
        setIsRunning(true);
        setIsPaused(false);
        setCurrentEntryId(activeTimer.id);
        setStartTime(new Date(activeTimer.startTime));
        setPausedTime(activeTimer.pausedTime || 0);
        // Calculate elapsed time
        const elapsed = Math.floor((Date.now() - new Date(activeTimer.startTime)) / 1000) - (activeTimer.pausedTime || 0);
        setElapsedTime(Math.max(0, elapsed));
      }
    };
    if (jobId) {
      loadActiveTimer();
    }
  }, [jobId]);

  // Timer tick
  useEffect(() => {
    let interval = null;
    if (isRunning && !isPaused && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000) - pausedTime;
        setElapsedTime(Math.max(0, elapsed));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, startTime, pausedTime]);

  const start = useCallback(async () => {
    // Stop any other active timers
    await stopAllActiveTimers();
    
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setIsPaused(false);
    setPausedTime(0);
    setElapsedTime(0);

    const entry = {
      jobId,
      startTime: now.toISOString(),
      isRunning: true,
      pausedTime: 0,
    };

    const id = await saveTimeEntry(entry);
    setCurrentEntryId(id);
  }, [jobId]);

  const pause = useCallback(async () => {
    if (isRunning && !isPaused && currentEntryId) {
      setIsPaused(true);
      const now = Date.now();
      const elapsed = Math.floor((now - startTime.getTime()) / 1000) - pausedTime;
      const newPausedTime = pausedTime + elapsed;
      setPausedTime(newPausedTime);
      setElapsedTime(0);

      await updateTimeEntry(currentEntryId, {
        isRunning: false,
        pausedTime: newPausedTime,
      });
    }
  }, [isRunning, isPaused, currentEntryId, startTime, pausedTime]);

  const resume = useCallback(async () => {
    if (isRunning && isPaused && currentEntryId) {
      setIsPaused(false);
      setStartTime(new Date());
      await updateTimeEntry(currentEntryId, {
        isRunning: true,
        startTime: new Date().toISOString(),
      });
    }
  }, [isRunning, isPaused, currentEntryId]);

  const stop = useCallback(async () => {
    if (currentEntryId && startTime) {
      const now = new Date();
      const totalElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedTime;
      const duration = Math.max(0, totalElapsed);

      await updateTimeEntry(currentEntryId, {
        isRunning: false,
        endTime: now.toISOString(),
        duration: duration, // in seconds
        pausedTime: pausedTime,
      });

      setIsRunning(false);
      setIsPaused(false);
      setElapsedTime(0);
      setStartTime(null);
      setPausedTime(0);
      setCurrentEntryId(null);
    }
  }, [currentEntryId, startTime, pausedTime]);

  const formatTime = useCallback((seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  return {
    isRunning,
    isPaused,
    elapsedTime,
    start,
    pause,
    resume,
    stop,
    formatTime,
  };
}
