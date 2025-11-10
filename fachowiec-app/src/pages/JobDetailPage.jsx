import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Person,
  CalendarToday,
  Flag,
  Description,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import TimeTracker from '../components/TimeTracker';

const mockJobs = [
  {
    id: 1,
    title: 'Instalacja oświetlenia LED',
    client: 'Marek Kowalski',
    status: 'W trakcie',
    priority: 'Wysoki',
    date: '2025-11-06',
    description: 'Montaż oświetlenia LED w biurze',
    address: 'ul. Przykładowa 123, Warszawa',
    phone: '+48 123 456 789',
  },
  {
    id: 2,
    title: 'Naprawa cieknącego kranu',
    client: 'Anna Nowak',
    status: 'Zaplanowane',
    priority: 'Średni',
    date: '2025-11-08',
    description: 'Wymiana uszczelek w kuchni',
    address: 'ul. Testowa 45, Kraków',
    phone: '+48 987 654 321',
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

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find(j => j.id === parseInt(id));

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ bgcolor: 'background.default', pb: 8 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Zlecenie nie zostało znalezione
          </Typography>
          <Button onClick={() => navigate('/jobs')} sx={{ mt: 2 }}>
            Powrót do listy zleceń
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ bgcolor: 'background.default', pb: 8 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/jobs')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            Szczegóły zlecenia
          </Typography>
        </Box>
        <Box>
          <IconButton 
            color="primary"
            onClick={() => navigate(`/jobs?edit=${job.id}`)}
          >
            <Edit />
          </IconButton>
          <IconButton color="error">
            <Delete />
          </IconButton>
        </Box>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {job.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip
              label={job.status}
              color={getStatusColor(job.status)}
              size="medium"
            />
            <Chip
              label={job.priority}
              color={getPriorityColor(job.priority)}
              size="medium"
              variant="outlined"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <List>
            <ListItem>
              <Person sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary="Klient"
                secondary={job.client}
              />
            </ListItem>
            <ListItem>
              <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary="Data"
                secondary={job.date}
              />
            </ListItem>
            <ListItem>
              <Flag sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary="Priorytet"
                secondary={job.priority}
              />
            </ListItem>
            {job.address && (
              <ListItem>
                <Description sx={{ mr: 2, color: 'text.secondary' }} />
                <ListItemText
                  primary="Adres"
                  secondary={job.address}
                />
              </ListItem>
            )}
            {job.phone && (
              <ListItem>
                <Description sx={{ mr: 2, color: 'text.secondary' }} />
                <ListItemText
                  primary="Telefon"
                  secondary={job.phone}
                />
              </ListItem>
            )}
          </List>

          {job.description && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Opis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.description}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      <TimeTracker jobId={job.id} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Edit />}
          onClick={() => navigate(`/jobs?edit=${job.id}`)}
        >
          Edytuj zlecenie
        </Button>
        <Button
          variant="outlined"
          fullWidth
          color="error"
          startIcon={<Delete />}
        >
          Usuń zlecenie
        </Button>
      </Box>
    </Container>
  );
};

export default JobDetailPage;
