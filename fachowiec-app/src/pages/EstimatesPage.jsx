import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
} from '@mui/material';
import {
  Description,
  Add,
  AttachMoney,
  Person,
  CalendarToday,
  Download,
  CheckCircle,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportEstimateToPDF } from '../utils/pdfExporter';
import { convertEstimateToJob } from '../data/estimateStore';

const mockEstimates = [
  {
    id: 1,
    clientName: 'Marek Kowalski',
    amount: 2500,
    status: 'draft',
    createdAt: '2025-01-15',
    dueDate: '2025-02-15',
  },
  {
    id: 2,
    clientName: 'Anna Nowak',
    amount: 1500,
    status: 'sent',
    createdAt: '2025-01-10',
    dueDate: '2025-02-10',
  },
  {
    id: 3,
    clientName: 'Piotr Wiśniewski',
    amount: 3200,
    status: 'accepted',
    createdAt: '2025-01-05',
    dueDate: '2025-02-05',
  },
];

const EstimatesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({});

  const handleExportPDF = async (estimate) => {
    try {
      const estimateData = {
        id: estimate.id,
        clientName: estimate.clientName,
        total: estimate.amount,
        subtotal: estimate.amount / 1.23, // Assuming 23% VAT
        tax: estimate.amount - (estimate.amount / 1.23),
        taxRate: 23,
        items: estimate.items || [],
        createdAt: estimate.createdAt,
        dueDate: estimate.dueDate,
        notes: estimate.notes || '',
      };
      await exportEstimateToPDF(estimateData, `oferta-${estimate.id}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Błąd podczas eksportu PDF');
    }
  };

  const handleConvertToJob = async (estimate) => {
    if (!window.confirm('Czy na pewno chcesz utworzyć zlecenie z tej oferty?')) {
      return;
    }

    setLoading({ ...loading, [estimate.id]: true });
    try {
      // For now, we'll use the estimate data directly
      // In a real app, you'd call convertEstimateToJob
      const estimateData = {
        id: estimate.id,
        clientName: estimate.clientName,
        title: `Zlecenie z oferty #${estimate.id}`,
        total: estimate.amount,
        clientId: estimate.clientId,
        dueDate: estimate.dueDate,
      };
      
      // Note: This would normally use convertEstimateToJob from estimateStore
      // but we're using mock data, so we'll just navigate
      navigate('/jobs');
      alert('Zlecenie zostało utworzone!');
    } catch (error) {
      console.error('Error converting estimate:', error);
      alert('Błąd podczas tworzenia zlecenia');
    } finally {
      setLoading({ ...loading, [estimate.id]: false });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'sent':
        return 'info';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft':
        return 'Szkic';
      case 'sent':
        return 'Wysłana';
      case 'accepted':
        return 'Zaakceptowana';
      case 'rejected':
        return 'Odrzucona';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="md" sx={{ bgcolor: 'background.default', py: 3, pb: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Description color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight="bold">
          Oferty
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Lista ofert
      </Typography>

      <List>
        {mockEstimates.map((estimate) => (
          <Card key={estimate.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Oferta #{estimate.id}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {estimate.clientName}
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={getStatusLabel(estimate.status)} 
                  color={getStatusColor(estimate.status)}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney fontSize="small" color="action" />
                  <Typography variant="body1" fontWeight="bold">
                    {estimate.amount.toLocaleString('pl-PL')} zł
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Ważna do: {estimate.dueDate}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button 
                  size="small" 
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleExportPDF(estimate)}
                >
                  PDF
                </Button>
                <Button size="small" variant="outlined">
                  Edytuj
                </Button>
                {estimate.status === 'accepted' && (
                  <Button 
                    size="small" 
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={() => handleConvertToJob(estimate)}
                    disabled={loading[estimate.id]}
                  >
                    {loading[estimate.id] ? 'Tworzenie...' : 'Utwórz zlecenie'}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
        }}
        onClick={() => navigate('/estimates/new')}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default EstimatesPage;
