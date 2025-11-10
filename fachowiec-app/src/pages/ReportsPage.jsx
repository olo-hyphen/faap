import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Assessment,
  Download,
  CalendarToday,
  AccessTime,
  Work,
} from '@mui/icons-material';
import { useState } from 'react';
import { generateReport } from '../utils/reportGenerator';
import { exportReportToPDF } from '../utils/pdfExporter';

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reportTypes = [
    { id: 'daily', label: 'Dzienny', icon: <CalendarToday /> },
    { id: 'weekly', label: 'Tygodniowy', icon: <CalendarToday /> },
    { id: 'monthly', label: 'Miesięczny', icon: <CalendarToday /> },
    { id: 'yearly', label: 'Roczny', icon: <CalendarToday /> },
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const date = new Date();
      const report = await generateReport(selectedPeriod, date);
      setReportData(report);
    } catch (err) {
      setError(err.message || 'Błąd podczas generowania raportu');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (reportData) {
      try {
        await exportReportToPDF(reportData, `raport-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (err) {
        setError(err.message || 'Błąd podczas eksportu PDF');
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ bgcolor: 'background.default', py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Assessment color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight="bold">
          Raporty
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Typy raportów
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {reportTypes.map((type) => (
          <Grid item xs={6} sm={3} key={type.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: selectedPeriod === type.id ? 2 : 0,
                borderColor: 'primary.main'
              }}
              onClick={() => setSelectedPeriod(type.id)}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ mb: 1 }}>
                  {type.icon}
                </Box>
                <Typography variant="body2">{type.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Raport {reportTypes.find(t => t.id === selectedPeriod)?.label.toLowerCase()}
          </Typography>
          
          {!reportData ? (
            <>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Raport zostanie wygenerowany dla wybranego okresu na podstawie danych z Time Tracking.
              </Typography>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Download />}
                fullWidth
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? 'Generowanie...' : 'Wygeneruj raport'}
              </Button>
            </>
          ) : (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ bgcolor: 'primary.dark' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AccessTime sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">
                        {reportData.totalHours}
                      </Typography>
                      <Typography variant="body2">godzin</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ bgcolor: 'success.dark' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Work sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">
                        {reportData.jobCount}
                      </Typography>
                      <Typography variant="body2">zleceń</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ bgcolor: 'info.dark' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Assessment sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">
                        {reportData.entryCount}
                      </Typography>
                      <Typography variant="body2">wpisów</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleGenerateReport}
                  fullWidth
                >
                  Wygeneruj ponownie
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleExportPDF}
                  fullWidth
                >
                  Eksportuj do PDF
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReportsPage;
