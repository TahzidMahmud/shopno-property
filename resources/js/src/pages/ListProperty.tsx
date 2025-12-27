import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Alert, Snackbar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import PropertyListingForm from '../components/PropertyListingForm';
import { propertyListingService, PropertyListingFormData } from '../services/propertyListingService';

const ListProperty: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: { pathname: '/list-property' } }} replace />;
  }

  const handleSubmit = async (data: PropertyListingFormData) => {
    setSubmitLoading(true);
    try {
      await propertyListingService.create(data);
      setNotification({
        open: true,
        message: 'Property listing submitted successfully! We will review it and get back to you soon.',
        severity: 'success',
      });
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to submit property listing. Please try again.',
        severity: 'error',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PropertyListingForm
          onSubmit={handleSubmit}
          loading={submitLoading}
        />
        
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </ProtectedRoute>
  );
};

export default ListProperty;


