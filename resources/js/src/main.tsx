import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import '../bootstrap'
import './styles.css'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PropertyProvider } from './context/PropertyContext'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PropertyProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </PropertyProvider>
    </BrowserRouter>
  </React.StrictMode>
)
