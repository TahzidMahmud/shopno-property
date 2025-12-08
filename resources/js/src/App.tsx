import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Home from './pages/Home'
import PropertyDetails from './pages/PropertyDetails';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import About from './pages/About';
import PrimaryLayout from './layouts/PrimaryLayout';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/admin/DashboardHome';
import PropertiesManagement from './pages/admin/PropertiesManagement';
import FacilitiesManagement from './pages/admin/FacilitiesManagement';
import HomePageManagement from './pages/admin/HomePageManagement';
import HeaderFooterManagement from './pages/admin/HeaderFooterManagement';
import ContactPageManagement from './pages/admin/ContactPageManagement';
import AboutPageManagement from './pages/admin/AboutPageManagement';

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
            <Route element={<PrimaryLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/property-details/:id" element={<PropertyDetails />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
            </Route>
            <Route element={<DashboardLayout />}>
                <Route path='/admin/dashboard' element={<DashboardHome />} />
                <Route path='/admin/dashboard/properties' element={<PropertiesManagement />} />
                <Route path='/admin/dashboard/facilities' element={<FacilitiesManagement />} />
                <Route path='/admin/dashboard/homepage' element={<HomePageManagement />} />
                <Route path='/admin/dashboard/header-footer' element={<HeaderFooterManagement />} />
                <Route path='/admin/dashboard/contact-page' element={<ContactPageManagement />} />
                <Route path='/admin/dashboard/about-page' element={<AboutPageManagement />} />
                <Route path='/admin/dashboard/users' element={<div>Users Management - Coming Soon</div>} />
                <Route path='/admin/dashboard/companies' element={<div>Companies Management - Coming Soon</div>} />
                <Route path='/admin/dashboard/settings' element={<div>Settings - Coming Soon</div>} />
            </Route>
        </Routes>
      </ThemeProvider>
    </>
  )
}
