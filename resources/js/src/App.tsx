import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Home from './pages/Home'
import PropertyDetails from './pages/PropertyDetails';
import Projects from './pages/Projects'; // Import Projects component
import PrimaryLayout from './layouts/PrimaryLayout';
import DashboardLayout from './layouts/DashboardLayout';

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
            <Route element={<PrimaryLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/property-details" element={<PropertyDetails />} />
                <Route path="/projects" element={<Projects />} />
            </Route>
            <Route element={<DashboardLayout />}>
                <Route path='/admin/dashboard' element={<></>} />
            </Route>

        </Routes>
      </ThemeProvider>
    </>
  )
}
