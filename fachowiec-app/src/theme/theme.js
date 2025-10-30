import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark', // Start with dark mode as per the designs
    primary: {
      main: '#1173d4',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
        fontSize: '1.75rem',
        fontWeight: 700,
    },
    h3: {
        fontSize: '1.5rem',
        fontWeight: 700,
    },
    body1: {
        fontSize: '1rem',
    },
    button: {
        textTransform: 'none',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
            }
        }
    }
  },
});

export default theme;