import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home'
import PropertyDetails from './pages/PropertyDetails';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import About from './pages/About';
import BlogListing from './pages/BlogListing';
import BlogDetails from './pages/BlogDetails';
import PrimaryLayout from './layouts/PrimaryLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/admin/Login';
import DashboardHome from './pages/admin/DashboardHome';
import PropertiesManagement from './pages/admin/PropertiesManagement';
import FacilitiesManagement from './pages/admin/FacilitiesManagement';
import HomePageManagement from './pages/admin/HomePageManagement';
import HeaderFooterManagement from './pages/admin/HeaderFooterManagement';
import ContactPageManagement from './pages/admin/ContactPageManagement';
import AboutPageManagement from './pages/admin/AboutPageManagement';
import ProjectsPageManagement from './pages/admin/ProjectsPageManagement';
import PartnerSubmissionsManagement from './pages/admin/PartnerSubmissionsManagement';
import PropertyQueriesManagement from './pages/admin/PropertyQueriesManagement';
import ContactEnquiriesManagement from './pages/admin/ContactEnquiriesManagement';
import PropertyListingsManagement from './pages/admin/PropertyListingsManagement';
import CompaniesManagement from './pages/admin/CompaniesManagement';
import PropertyTypesManagement from './pages/admin/PropertyTypesManagement';
import UsersManagement from './pages/admin/UsersManagement';
import RolesManagement from './pages/admin/RolesManagement';
import Register from './pages/Register';
import ListProperty from './pages/ListProperty';

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Routes>
              <Route element={<PrimaryLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/property-details/:id" element={<PropertyDetails />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blogs" element={<BlogListing />} />
                  <Route path="/blogs/:id" element={<BlogDetails />} />
              </Route>
              <Route path="/admin/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/list-property" element={<ListProperty />} />
              <Route element={<DashboardLayout />}>
                  <Route path='/admin/dashboard' element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/properties' element={<ProtectedRoute><PropertiesManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/facilities' element={<ProtectedRoute><FacilitiesManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/homepage' element={<ProtectedRoute><HomePageManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/header-footer' element={<ProtectedRoute><HeaderFooterManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/contact-page' element={<ProtectedRoute><ContactPageManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/about-page' element={<ProtectedRoute><AboutPageManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/projects-page' element={<ProtectedRoute><ProjectsPageManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/partner-submissions' element={<ProtectedRoute><PartnerSubmissionsManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/property-queries' element={<ProtectedRoute><PropertyQueriesManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/contact-enquiries' element={<ProtectedRoute><ContactEnquiriesManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/property-listings' element={<ProtectedRoute><PropertyListingsManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/users' element={<ProtectedRoute><UsersManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/roles' element={<ProtectedRoute><RolesManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/companies' element={<ProtectedRoute><CompaniesManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/property-types' element={<ProtectedRoute><PropertyTypesManagement /></ProtectedRoute>} />
                  <Route path='/admin/dashboard/settings' element={<ProtectedRoute><div>Settings - Coming Soon</div></ProtectedRoute>} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
