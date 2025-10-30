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
} from '@mui/material';
import { Search, Group, SwapVert, ChevronRight } from '@mui/icons-material';
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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <ListItem key={client.id} button>
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
    </Container>
  );
};

export default ClientListPage;