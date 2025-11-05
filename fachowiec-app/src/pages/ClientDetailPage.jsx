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
  Phone,
  Email,
  LocationOn,
  Edit,
  Assignment,
  CalendarToday,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import mockClients from '../data/mockClients';

const mockClientJobs = [
  {
    id: 1,
    title: 'Instalacja oświetlenia LED',
    status: 'W trakcie',
    date: '2025-11-06',
  },
  {
    id: 2,
    title: 'Naprawa instalacji elektrycznej',
    status: 'Zakończone',
    date: '2025-10-15',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'problem':
      return 'error';
    default:
      return 'default';
  }
};

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = mockClients.find(c => c.id === parseInt(id));

  if (!client) {
    return (
      <Container maxWidth="md" sx={{ bgcolor: 'background.default', pb: 8 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Klient nie został znaleziony
          </Typography>
          <Button onClick={() => navigate('/clients')} sx={{ mt: 2 }}>
            Powrót do listy klientów
          </Button>
        </Box>
      </Container>
    );
  }

  const statusColor = getStatusColor(client.status);
  const statusLabels = {
    active: 'Aktywny',
    pending: 'Oczekujący',
    problem: 'Problem',
  };

  return (
    <Container maxWidth="md" sx={{ bgcolor: 'background.default', pb: 8 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 2,
        }}
      >
        <IconButton onClick={() => navigate('/clients')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          Szczegóły klienta
        </Typography>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar
              src={client.avatarUrl}
              alt={client.name}
              sx={{ width: 80, height: 80 }}
            >
              {client.initials}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                {client.name}
              </Typography>
              <Chip
                label={statusLabels[client.status]}
                color={statusColor}
                size="small"
              />
            </Box>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => navigate('/clients')}
            >
              Powrót
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <List>
            <ListItem>
              <Phone sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary="Telefon"
                secondary={client.contact.includes('+48') ? client.contact : 'Brak'}
              />
            </ListItem>
            <ListItem>
              <Email sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary="Email"
                secondary={client.contact.includes('@') ? client.contact : 'Brak'}
              />
            </ListItem>
            <ListItem>
              <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary="Adres"
                secondary="Nie podano"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Zlecenia klienta
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<Assignment />}
              onClick={() => navigate('/jobs')}
            >
              Dodaj zlecenie
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {mockClientJobs.length > 0 ? (
            <List>
              {mockClientJobs.map((job) => (
                <ListItem
                  key={job.id}
                  button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={job.title}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <CalendarToday sx={{ fontSize: 14 }} />
                        <Typography variant="caption">{job.date}</Typography>
                        <Chip
                          label={job.status}
                          size="small"
                          color={job.status === 'Zakończone' ? 'success' : 'primary'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              Brak zleceń dla tego klienta
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ClientDetailPage;
