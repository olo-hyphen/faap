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
  Tab,
  Tabs,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  ElectricalServices,
  Plumbing,
  FormatPaint,
  Construction,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useState } from 'react';

const mockJobs = [
  {
    id: 1,
    title: 'Instalacja oświetlenia LED',
    client: 'Marek Kowalski',
    status: 'W trakcie',
    priority: 'Wysoki',
    date: '2025-11-06',
    icon: <ElectricalServices />,
    description: 'Montaż oświetlenia LED w biurze',
  },
  {
    id: 2,
    title: 'Naprawa cieknącego kranu',
    client: 'Anna Nowak',
    status: 'Zaplanowane',
    priority: 'Średni',
    date: '2025-11-08',
    icon: <Plumbing />,
    description: 'Wymiana uszczelek w kuchni',
  },
  {
    id: 3,
    title: 'Malowanie pokoju',
    client: 'Piotr Wiśniewski',
    status: 'Zaplanowane',
    priority: 'Niski',
    date: '2025-11-10',
    icon: <FormatPaint />,
    description: 'Malowanie sypialni na biało',
  },
  {
    id: 4,
    title: 'Remont łazienki',
    client: 'Tech Corp',
    status: 'Zakończone',
    priority: 'Wysoki',
    date: '2025-11-01',
    icon: <Construction />,
    description: 'Kompleksowy remont łazienki',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'W trakcie':
      return 'primary';
    case 'Zaplanowane':
      return 'warning';
    case 'Zakończone':
      return 'success';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Wysoki':
      return 'error';
    case 'Średni':
      return 'warning';
    case 'Niski':
      return 'info';
    default:
      return 'default';
  }
};

const JobsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [jobs, setJobs] = useState(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    client: '',
    status: 'Zaplanowane',
    priority: 'Średni',
    date: '',
    description: '',
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewJob({
      title: '',
      client: '',
      status: 'Zaplanowane',
      priority: 'Średni',
      date: '',
      description: '',
    });
  };

  const handleAddJob = () => {
    const job = {
      ...newJob,
      id: jobs.length + 1,
      icon: <Construction />,
    };
    setJobs([...jobs, job]);
    handleCloseDialog();
  };

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tabValue === 0) return matchesSearch && job.status !== 'Zakończone';
    if (tabValue === 1) return matchesSearch && job.status === 'W trakcie';
    if (tabValue === 2) return matchesSearch && job.status === 'Zakończone';
    return matchesSearch;
  });

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
          <Construction color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h6" fontWeight="bold">
            Zlecenia
          </Typography>
        </Box>
        <Box>
          <IconButton>
            <Search />
          </IconButton>
          <IconButton>
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      <TextField
        fullWidth
        placeholder="Szukaj zlecenia lub klienta..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Wszystkie" />
          <Tab label="W trakcie" />
          <Tab label="Zakończone" />
        </Tabs>
      </Box>

      <List>
        {filteredJobs.map((job) => (
          <Card key={job.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>{job.icon}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {job.client}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {job.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={job.status}
                        color={getStatusColor(job.status)}
                        size="small"
                      />
                      <Chip
                        label={job.priority}
                        color={getPriorityColor(job.priority)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip label={job.date} size="small" variant="outlined" />
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <IconButton size="small" color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>

      {filteredJobs.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">Brak zleceń do wyświetlenia</Typography>
        </Box>
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
        <DialogTitle>Dodaj nowe zlecenie</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tytuł zlecenia"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Klient"
            value={newJob.client}
            onChange={(e) => setNewJob({ ...newJob, client: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Opis"
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newJob.status}
              label="Status"
              onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
            >
              <MenuItem value="Zaplanowane">Zaplanowane</MenuItem>
              <MenuItem value="W trakcie">W trakcie</MenuItem>
              <MenuItem value="Zakończone">Zakończone</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priorytet</InputLabel>
            <Select
              value={newJob.priority}
              label="Priorytet"
              onChange={(e) => setNewJob({ ...newJob, priority: e.target.value })}
            >
              <MenuItem value="Niski">Niski</MenuItem>
              <MenuItem value="Średni">Średni</MenuItem>
              <MenuItem value="Wysoki">Wysoki</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Data"
            type="date"
            value={newJob.date}
            onChange={(e) => setNewJob({ ...newJob, date: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Anuluj</Button>
          <Button onClick={handleAddJob} variant="contained">
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobsPage;
