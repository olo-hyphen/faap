import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material';
import {
  Settings,
  DarkMode,
  Language,
  Backup,
  Restore,
  Download,
  Upload,
  Delete,
} from '@mui/icons-material';

const SettingsPage = () => {
  return (
    <Container maxWidth="md" sx={{ bgcolor: 'background.default', py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Settings color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight="bold">
          Ustawienia
        </Typography>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Wygląd
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <DarkMode />
              </ListItemIcon>
              <ListItemText 
                primary="Tryb ciemny"
                secondary="Włącz tryb ciemny interfejsu"
              />
              <Switch defaultChecked />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Dane
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Download />
              </ListItemIcon>
              <ListItemText 
                primary="Eksport danych"
                secondary="Pobierz kopię zapasową danych"
              />
              <Button variant="outlined" size="small">
                Eksportuj
              </Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Upload />
              </ListItemIcon>
              <ListItemText 
                primary="Import danych"
                secondary="Przywróć dane z kopii zapasowej"
              />
              <Button variant="outlined" size="small">
                Importuj
              </Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText 
                primary="Usuń wszystkie dane"
                secondary="Trwale usuń wszystkie dane z aplikacji"
              />
              <Button variant="outlined" color="error" size="small">
                Usuń
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Informacje
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fachowiec PWA v1.0.0
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Aplikacja offline-first do zarządzania zleceniami
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SettingsPage;
