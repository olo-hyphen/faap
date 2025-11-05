import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add,
  ChevronLeft,
  ChevronRight,
  CalendarMonth,
  ElectricalServices,
  Plumbing,
  FormatPaint,
  Construction,
} from '@mui/icons-material';
import { useState } from 'react';
import { detectScheduleConflicts, getConflictsForDate } from '../utils/scheduleConflictDetector';

const monthNames = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

const dayNames = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];

const mockEvents = [
  {
    id: 1,
    title: 'Instalacja oświetlenia LED',
    client: 'Marek Kowalski',
    date: '2025-11-06',
    time: '9:00',
    icon: <ElectricalServices />,
    color: 'primary',
    status: 'W trakcie',
  },
  {
    id: 2,
    title: 'Naprawa cieknącego kranu',
    client: 'Anna Nowak',
    date: '2025-11-08',
    time: '14:00',
    icon: <Plumbing />,
    color: 'info',
    status: 'Zaplanowane',
  },
  {
    id: 3,
    title: 'Malowanie pokoju',
    client: 'Piotr Wiśniewski',
    date: '2025-11-10',
    time: '10:00',
    icon: <FormatPaint />,
    color: 'warning',
    status: 'Zaplanowane',
  },
  {
    id: 4,
    title: 'Konsultacja budowlana',
    client: 'Tech Corp',
    date: '2025-11-06',
    time: '10:00', // Changed to create conflict with event 1
    icon: <Construction />,
    color: 'success',
    status: 'Zaplanowane',
  },
];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(mockEvents);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [newEvent, setNewEvent] = useState({
    title: '',
    client: '',
    date: '',
    time: '',
    status: 'Zaplanowane',
  });

  // Convert events to jobs format for conflict detection
  const jobs = events.map(event => ({
    id: event.id,
    scheduledDate: event.date,
    scheduledTime: event.time,
    title: event.title,
    status: event.status || 'Zaplanowane',
  }));

  // Filter events by status
  const filteredEvents = statusFilter === 'all' 
    ? events 
    : events.filter(event => event.status === statusFilter);

  // Get conflicts for all dates
  const conflicts = getConflictsForDate(jobs, currentDate);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 };
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => event.date === dateStr);
  };

  const hasConflictsOnDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return conflicts.some(conflict => {
      const conflictDate = new Date(conflict.scheduledDate);
      return conflictDate.toISOString().split('T')[0] === dateStr;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewEvent({
      title: '',
      client: '',
      date: '',
      time: '',
    });
  };

  const handleAddEvent = () => {
    const newJob = {
      id: events.length + 1,
      scheduledDate: newEvent.date,
      scheduledTime: newEvent.time,
      title: newEvent.title,
      status: newEvent.status || 'Zaplanowane',
    };

    // Check for conflicts
    const conflictJobs = detectScheduleConflicts(jobs, newJob);
    
    if (conflictJobs.length > 0) {
      const confirmAdd = window.confirm(
        `Uwaga: Wykryto ${conflictJobs.length} konflikt(ów) harmonogramu w tym dniu. Czy chcesz kontynuować?`
      );
      if (!confirmAdd) {
        return;
      }
    }

    const event = {
      ...newEvent,
      id: newJob.id,
      icon: <Construction />,
      color: 'primary',
      status: newEvent.status || 'Zaplanowane',
    };
    setEvents([...events, event]);
    handleCloseDialog();
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    // Empty cells before the first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <Grid item xs={12/7} key={`empty-${i}`}>
          <Box sx={{ height: 80 }} />
        </Grid>
      );
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = 
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      days.push(
        <Grid item xs={12/7} key={day}>
          <Box
            onClick={() => handleDateClick(day)}
            sx={{
              height: 80,
              border: 1,
              borderColor: hasConflictsOnDate(date) 
                ? 'error.main' 
                : isSelected 
                  ? 'primary.main' 
                  : 'divider',
              borderWidth: hasConflictsOnDate(date) ? 2 : 1,
              borderRadius: 1,
              p: 0.5,
              cursor: 'pointer',
              bgcolor: isToday ? 'primary.dark' : 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Typography
              variant="body2"
              fontWeight={isToday ? 'bold' : 'normal'}
              color={isToday ? 'primary.contrastText' : 'text.primary'}
            >
              {day}
            </Typography>
            {dayEvents.length > 0 && (
              <Box sx={{ mt: 0.5 }}>
                {dayEvents.slice(0, 2).map((event, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      bgcolor: `${event.color}.main`,
                      borderRadius: 0.5,
                      px: 0.5,
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                      {event.time} {event.title}
                    </Typography>
                  </Box>
                ))}
                {dayEvents.length > 2 && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                    +{dayEvents.length - 2} więcej
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Grid>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <Container maxWidth="md" sx={{ bgcolor: 'background.default', pb: 8 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonth color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h6" fontWeight="bold">
            Kalendarz
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <IconButton onClick={handlePreviousMonth}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h6" fontWeight="bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <IconButton onClick={handleNextMonth}>
              <ChevronRight />
            </IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Filtr statusu</InputLabel>
            <Select
              value={statusFilter}
              label="Filtr statusu"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Wszystkie</MenuItem>
              <MenuItem value="Zaplanowane">Zaplanowane</MenuItem>
              <MenuItem value="W trakcie">W trakcie</MenuItem>
              <MenuItem value="Zakończone">Zakończone</MenuItem>
            </Select>
          </FormControl>

          {conflicts.length > 0 && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'error.dark', borderRadius: 1 }}>
              <Typography variant="caption" color="error.contrastText">
                ⚠️ Wykryto {conflicts.length} konflikt(ów) harmonogramu w tym miesiącu
              </Typography>
            </Box>
          )}

          <Grid container spacing={0.5}>
            {dayNames.map((day) => (
              <Grid item xs={12/7} key={day}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  align="center"
                  display="block"
                  color="text.secondary"
                >
                  {day}
                </Typography>
              </Grid>
            ))}
            {renderCalendar()}
          </Grid>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Typography>
            {selectedDateEvents.length > 0 ? (
              <List>
                {selectedDateEvents.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${event.color}.light` }}>
                        {event.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={event.title}
                      secondary={`${event.client} • ${event.time}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                Brak wydarzeń w tym dniu
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={handleOpenDialog}
      >
        <Add />
      </Fab>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Dodaj wydarzenie</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tytuł"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Klient"
            value={newEvent.client}
            onChange={(e) => setNewEvent({ ...newEvent, client: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Data"
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Godzina"
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={newEvent.status || 'Zaplanowane'}
              label="Status"
              onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
            >
              <MenuItem value="Zaplanowane">Zaplanowane</MenuItem>
              <MenuItem value="W trakcie">W trakcie</MenuItem>
              <MenuItem value="Zakończone">Zakończone</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Anuluj</Button>
          <Button onClick={handleAddEvent} variant="contained">
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CalendarPage;
