import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import FacilityList from '../../components/admin/FacilityList';
import FacilityForm from '../../components/admin/FacilityForm';
import FacilityDetails from '../../components/admin/FacilityDetails';
import { Facility, FacilityFormData } from '../../types/Facility';
import { facilityService } from '../../services/facilityService';

type ViewMode = 'list' | 'form' | 'details';

const FacilitiesManagement: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load facilities on component mount
  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const data = await facilityService.getAll();
      setFacilities(data);
    } catch (error: any) {
      showNotification('Failed to load facilities', 'error');
      console.error('Error loading facilities:', error);
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

  // Handle adding new facility
  const handleAdd = () => {
    setSelectedFacility(null);
    setViewMode('form');
  };

  // Handle editing facility
  const handleEdit = (facility: Facility) => {
    setSelectedFacility(facility);
    setViewMode('form');
  };

  // Handle viewing facility details
  const handleView = (facility: Facility) => {
    setSelectedFacility(facility);
    setViewMode('details');
  };

  // Handle deleting facility
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await facilityService.delete(id);
      setFacilities(prev => prev.filter(f => f.id !== id));
      showNotification('Facility deleted successfully');
    } catch (error: any) {
      showNotification('Failed to delete facility', 'error');
      console.error('Error deleting facility:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create/update)
  const handleFormSubmit = async (data: FacilityFormData) => {
    setSubmitLoading(true);
    try {
      if (selectedFacility) {
        // Update existing facility
        const updatedFacility = await facilityService.update(selectedFacility.id!, data);
        setFacilities(prev =>
          prev.map(f => f.id === selectedFacility.id ? updatedFacility : f)
        );
        showNotification('Facility updated successfully');
      } else {
        // Create new facility
        const newFacility = await facilityService.create(data);
        setFacilities(prev => [...prev, newFacility]);
        showNotification('Facility created successfully');
      }
      setViewMode('list');
      setSelectedFacility(null);
    } catch (error: any) {
      showNotification(
        selectedFacility ? 'Failed to update facility' : 'Failed to create facility',
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
    setSelectedFacility(null);
  };

  // Handle back to list
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedFacility(null);
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
          <FacilityList
            facilities={facilities}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}

        {viewMode === 'form' && (
          <FacilityForm
            facility={selectedFacility || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={submitLoading}
          />
        )}

        {viewMode === 'details' && selectedFacility && (
          <FacilityDetails
            facility={selectedFacility}
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

export default FacilitiesManagement;
