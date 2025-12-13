import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import PropertyList from '../../components/admin/PropertyList';
import PropertyForm from '../../components/admin/PropertyForm';
import PropertyDetails from '../../components/admin/PropertyDetails';
import { Property, PropertyFormData } from '../../types/Property';
import { propertyService } from '../../services/propertyService';

type ViewMode = 'list' | 'form' | 'details';

const PropertiesManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (error: any) {
      showNotification('Failed to load properties', 'error');
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Handle adding new property
  const handleAdd = () => {
    setSelectedProperty(null);
    setViewMode('form');
  };

  // Handle editing property
  const handleEdit = async (property: Property) => {
    // Fetch full property data to ensure all fields are loaded
    try {
      if (property.id) {
        const fullProperty = await propertyService.getById(property.id);
        setSelectedProperty(fullProperty);
      } else {
        setSelectedProperty(property);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      // Fallback to using property from list
      setSelectedProperty(property);
    }
    setViewMode('form');
  };

  // Handle viewing property details
  const handleView = (property: Property) => {
    setSelectedProperty(property);
    setViewMode('details');
  };

  // Handle deleting property
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await propertyService.delete(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      showNotification('Property deleted successfully');
    } catch (error: any) {
      showNotification('Failed to delete property', 'error');
      console.error('Error deleting property:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create/update)
  const handleFormSubmit = async (data: PropertyFormData) => {
    setSubmitLoading(true);
    try {
      if (selectedProperty) {
        // Update existing property
        const updatedProperty = await propertyService.update(selectedProperty.id!, data);
        setProperties(prev =>
          prev.map(p => p.id === selectedProperty.id ? updatedProperty : p)
        );
        showNotification('Property updated successfully');
      } else {
        // Create new property
        const newProperty = await propertyService.create(data);
        setProperties(prev => [...prev, newProperty]);
        showNotification('Property created successfully');
      }
      setViewMode('list');
      setSelectedProperty(null);
    } catch (error: any) {
      showNotification(
        selectedProperty ? 'Failed to update property' : 'Failed to create property',
        'error'
      );
      console.error('Error submitting form:', error);
      throw error; // Re-throw to let form handle validation errors
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedProperty(null);
  };

  // Handle back to list
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedProperty(null);
  };

  // Handle edit from details view
  const handleEditFromDetails = () => {
    setViewMode('form');
  };

  return (
    <Box>
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && viewMode === 'list'}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Main Content */}
      <Box>
        {viewMode === 'list' && (
          <PropertyList
            properties={properties}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}

        {viewMode === 'form' && (
          <PropertyForm
            property={selectedProperty || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={submitLoading}
          />
        )}

        {viewMode === 'details' && selectedProperty && (
          <PropertyDetails
            property={selectedProperty}
            onEdit={handleEditFromDetails}
            onBack={handleBackToList}
          />
        )}
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PropertiesManagement;
