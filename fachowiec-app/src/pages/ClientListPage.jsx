import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Toolbar,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Group, SwapVert, ChevronRight, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import mockClients from '../data/mockClients';

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success.main';
    case 'pending':
      return 'warning.main';
    case 'problem':
      return 'error.main';
    default:
      return 'grey.500';
  }
};

const ClientListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState(mockClients);
  const [openDialog, setOpenDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    contact: '',
    status: 'active',
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewClient({
      name: '',
      contact: '',
      status: 'active',
    });
  };

  const handleAddClient = () => {
    const client = {
      ...newClient,
      id: clients.length + 1,
      initials: newClient.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    };
    setClients([...clients, client]);
    handleCloseDialog();
  };

  return (
    <Container maxWidth="md" disableGutters>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Group sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Klienci
          </Typography>
          <IconButton color="inherit">
            <Search />
          </IconButton>
          <IconButton color="inherit">
            <SwapVert />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 2, p: '2px 4px' }}>
            <IconButton sx={{ p: '10px' }} aria-label="menu">
                <Search />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Szukaj po nazwie, firmie, tel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </Box>
      </Box>

      <List sx={{ width: '100%' }}>
        {filteredClients.map((client) => (
          <ListItem 
            key={client.id} 
            button
            onClick={() => navigate(`/clients/${client.id}`)}
          >
            <ListItemAvatar>
              <Avatar src={client.avatarUrl} alt={client.name}>
                {client.initials}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={client.name} secondary={client.contact} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: getStatusColor(client.status) }} />
                <ChevronRight color="action" />
            </Box>
          </ListItem>
        ))}
      </List>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={handleOpenDialog}
      >
        <Add />
      </Fab>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Dodaj nowego klienta</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nazwa klienta"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Kontakt (telefon lub email)"
            value={newClient.contact}
            onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={newClient.status}
              label="Status"
              onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
            >
              <MenuItem value="active">Aktywny</MenuItem>
              <MenuItem value="pending">Oczekujący</MenuItem>
              <MenuItem value="problem">Problem</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Anuluj</Button>
          <Button onClick={handleAddClient} variant="contained">
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientListPage;