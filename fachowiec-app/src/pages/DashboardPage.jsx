import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  Construction,
  Person,
  AddCircle,
  PersonAdd,
  ElectricalServices,
  Plumbing,
  FormatPaint,
  Assessment,
  Description,
  Settings,
  CalendarMonth,
  ListAlt,
  Group,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const summaryData = [
  { title: 'Aktywne zlecenia', value: '8', change: '+2%', changeColor: 'success.main' },
  { title: 'Zakończone', value: '12', change: '-5%', changeColor: 'error.main' },
];

const revenueData = {
  title: 'Przychód w tym m-cu',
  value: '15,230 zł',
  change: '+10%',
  changeColor: 'success.main',
};

const recentActivities = [
    { icon: <ElectricalServices />, primary: 'Instalacja oświetlenia', secondary: 'Marek Kowalski', time: 'Jutro', timeDetail: '9:00' },
    { icon: <Plumbing />, primary: 'Naprawa cieknącego kranu', secondary: 'Anna Nowak', time: '25.07', timeDetail: '14:00' },
    { icon: <FormatPaint />, primary: 'Malowanie pokoju', secondary: 'Piotr Wiśniewski', time: '28.07', timeDetail: '10:00' },
];

const DashboardPage = () => {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleAddJob = () => {
        navigate('/jobs');
    };

    const handleAddClient = () => {
        navigate('/clients');
    };

  return (
    <Container maxWidth="md" sx={{ bgcolor: 'background.default' }}>
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
            Firma XYZ
          </Typography>
        </Box>
        <Avatar>
          <Person />
        </Avatar>
      </Box>

      <Typography variant="h4" fontWeight="bold" sx={{ py: 2 }}>
        Dzień dobry, Jan!
      </Typography>

      <Typography variant="h6" fontWeight="bold" sx={{ pt: 2, pb: 1 }}>
        Twój przegląd
      </Typography>

      <Grid container spacing={2}>
        {summaryData.map((item, index) => (
          <Grid item xs={6} key={index}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">{item.title}</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {item.value}
                </Typography>
                <Typography color={item.changeColor}>{item.change}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">{revenueData.title}</Typography>
              <Typography variant="h4" fontWeight="bold">
                {revenueData.value}
              </Typography>
              <Typography color={revenueData.changeColor}>
                {revenueData.change}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" sx={{ pt: 2, pb: 1 }}>
        Szybkie akcje
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
            <Button 
                variant="contained" 
                fullWidth 
                startIcon={<AddCircle />}
                onClick={handleAddJob}
            >
                Dodaj zlecenie
            </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<PersonAdd />}
                onClick={handleAddClient}
            >
                Dodaj klienta
            </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" sx={{ pt: 2, pb: 1 }}>
        Szybkie linki
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={4}>
          <Card 
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => navigate('/jobs')}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <ListAlt color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2">Zlecenia</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card 
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => navigate('/clients')}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Group color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2">Klienci</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card 
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => navigate('/calendar')}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CalendarMonth color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2">Kalendarz</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card 
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => navigate('/reports')}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Assessment color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2">Raporty</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card 
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => navigate('/estimates')}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Description color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2">Oferty</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card 
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => navigate('/settings')}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Settings color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2">Ustawienia</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" sx={{ pt: 2, pb: 1 }}>
        Ostatnia aktywność
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Nadchodzące" />
            <Tab label="Ostatnie" />
        </Tabs>
      </Box>
      <List>
          {recentActivities.map((item, index) => (
              <ListItem key={index} button>
                  <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>{item.icon}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.primary} secondary={item.secondary} />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.primary">{item.time}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.timeDetail}</Typography>
                  </Box>
              </ListItem>
          ))}
      </List>
    </Container>
  );
};

export default DashboardPage;