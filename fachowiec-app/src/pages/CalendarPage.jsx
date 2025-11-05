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
  },
  {
    id: 2,
    title: 'Naprawa cieknącego kranu',
    client: 'Anna Nowak',
    date: '2025-11-08',
    time: '14:00',
    icon: <Plumbing />,
    color: 'info',
  },
  {
    id: 3,
    title: 'Malowanie pokoju',
    client: 'Piotr Wiśniewski',
    date: '2025-11-10',
    time: '10:00',
    icon: <FormatPaint />,
    color: 'warning',
  },
  {
    id: 4,
    title: 'Konsultacja budowlana',
    client: 'Tech Corp',
    date: '2025-11-06',
    time: '15:00',
    icon: <Construction />,
    color: 'success',
  },
];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(mockEvents);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    client: '',
    date: '',
    time: '',
  });

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
    return events.filter(event => event.date === dateStr);
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
    const event = {
      ...newEvent,
      id: events.length + 1,
      icon: <Construction />,
      color: 'primary',
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
              borderColor: isSelected ? 'primary.main' : 'divider',
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
          />
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
