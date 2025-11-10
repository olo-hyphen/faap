import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { PlayArrow, Pause, Stop } from '@mui/icons-material';
import { useTimeTracking } from '../hooks/useTimeTracking';

const TimeTracker = ({ jobId }) => {
  const {
    isRunning,
    isPaused,
    elapsedTime,
    start,
    pause,
    resume,
    stop,
    formatTime,
  } = useTimeTracking(jobId);

  if (!jobId) {
    return null;
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Śledzenie czasu
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            color="primary"
            sx={{ fontFamily: 'monospace' }}
          >
            {formatTime(elapsedTime)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {!isRunning && !isPaused && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={start}
              fullWidth
            >
              Start
            </Button>
          )}
          {isRunning && !isPaused && (
            <>
              <Button
                variant="outlined"
                startIcon={<Pause />}
                onClick={pause}
                sx={{ flex: 1 }}
              >
                Pauza
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Stop />}
                onClick={stop}
                sx={{ flex: 1 }}
              >
                Stop
              </Button>
            </>
          )}
          {isPaused && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrow />}
                onClick={resume}
                sx={{ flex: 1 }}
              >
                Wznów
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Stop />}
                onClick={stop}
                sx={{ flex: 1 }}
              >
                Stop
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeTracker;
