import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import PropertyTypeList from '../../components/admin/PropertyTypeList';
import PropertyTypeForm from '../../components/admin/PropertyTypeForm';
import { PropertyType, PropertyTypeFormData } from '../../services/propertyTypeService';
import { propertyTypeService } from '../../services/propertyTypeService';

type ViewMode = 'list' | 'form';

const PropertyTypesManagement: React.FC = () => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadPropertyTypes();
  }, []);

  const loadPropertyTypes = async () => {
    setLoading(true);
    try {
      const data = await propertyTypeService.getAll();
      setPropertyTypes(data || []);
    } catch (error: any) {
      console.error('Error loading property types:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load property types';
      showNotification(errorMessage, 'error');
      setPropertyTypes([]);
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

  const handleAdd = () => {
    setSelectedPropertyType(null);
    setViewMode('form');
  };

  const handleEdit = (propertyType: PropertyType) => {
    setSelectedPropertyType(propertyType);
    setViewMode('form');
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await propertyTypeService.delete(id);
      setPropertyTypes(prev => prev.filter(pt => pt.id !== id));
      showNotification('Property type deleted successfully');
    } catch (error: any) {
      showNotification('Failed to delete property type', 'error');
      console.error('Error deleting property type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: PropertyTypeFormData) => {
    setSubmitLoading(true);
    try {
      if (selectedPropertyType) {
        const updatedPropertyType = await propertyTypeService.update(selectedPropertyType.id!, data);
        setPropertyTypes(prev =>
          prev.map(pt => pt.id === selectedPropertyType.id ? updatedPropertyType : pt)
        );
        showNotification('Property type updated successfully');
      } else {
        const newPropertyType = await propertyTypeService.create(data);
        setPropertyTypes(prev => [...prev, newPropertyType]);
        showNotification('Property type created successfully');
      }
      setViewMode('list');
      setSelectedPropertyType(null);
    } catch (error: any) {
      showNotification(
        selectedPropertyType ? 'Failed to update property type' : 'Failed to create property type',
        'error'
      );
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedPropertyType(null);
  };

  return (
    <Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && viewMode === 'list'}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box>
        {viewMode === 'list' && (
          <PropertyTypeList
            propertyTypes={propertyTypes}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {viewMode === 'form' && (
          <PropertyTypeForm
            propertyType={selectedPropertyType || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={submitLoading}
          />
        )}
      </Box>

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

export default PropertyTypesManagement;


