import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main : '#FAF9F6'
    },
    secondary: {
      main: '#e6f4ff',
    },
  },
  typography: {
    h1 : {
      fontSize: '3rem',
      fontWeight: 600,
    },
    h2 : {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h3 : {
      fontSize: '1.5rem',
      fontWeight: 500,
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
