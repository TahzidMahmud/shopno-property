import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00bcd4', // Cyan/light blue from the design
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#424242', // Dark grey for secondary elements
      contrastText: '#ffffff',
    },
    text: {
      primary: '#212121', // Darker text
      secondary: '#757575', // Lighter text
    },
    background: {
      default: '#f5f5f5', // Light grey background
      paper: '#ffffff', // White paper background
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      color: '#ffffff', // White for hero text
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#212121',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#212121',
    },
    logo: { // Custom variant for logo
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#212121',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 20px',
        },
        containedPrimary: {
          backgroundColor: '#00bcd4',
          '&:hover': {
            backgroundColor: '#0097a7',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // White header background
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', // Subtle shadow
          color: '#212121', // Dark text for header
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '10px 20px',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: '#212121', // Dark text for links
          '&:hover': {
            textDecoration: 'underline',
            color: '#00bcd4', // Primary color on hover
          },
        },
      },
    },
    MuiOutlinedInput: { // Styling for Select and other outlined inputs
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#ffffff',
          '& fieldset': {
            borderColor: '#e0e0e0',
          },
          '&:hover fieldset': {
            borderColor: '#00bcd4',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#00bcd4',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#757575',
        },
      },
    },
  },
});

export default theme;
