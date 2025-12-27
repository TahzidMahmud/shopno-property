import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  Button,
} from '@mui/material';
import RoleList from '../../components/admin/RoleList';
import RoleForm from '../../components/admin/RoleForm';
import { Role, RoleFormData, roleService } from '../../services/roleService';

type ViewMode = 'list' | 'form';

const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
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
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await roleService.getAll();
      setRoles(data || []);
    } catch (error: any) {
      console.error('Error loading roles:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load roles';
      showNotification(errorMessage, 'error');
      setRoles([]);
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
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleAdd = () => {
    setSelectedRole(null);
    setViewMode('form');
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setViewMode('form');
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await roleService.delete(id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
      showNotification('Role deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete role';
      showNotification(errorMessage, 'error');
      console.error('Error deleting role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: RoleFormData) => {
    setSubmitLoading(true);
    try {
      if (selectedRole) {
        const updatedRole = await roleService.update(selectedRole.id!, data);
        setRoles((prev) =>
          prev.map((r) => (r.id === selectedRole.id ? updatedRole : r))
        );
        showNotification('Role updated successfully');
      } else {
        const newRole = await roleService.create(data);
        setRoles((prev) => [...prev, newRole]);
        showNotification('Role created successfully');
      }
      setViewMode('list');
      setSelectedRole(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
        (selectedRole ? 'Failed to update role' : 'Failed to create role');
      showNotification(errorMessage, 'error');
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedRole(null);
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
          <RoleList
            roles={roles}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {viewMode === 'form' && (
          <RoleForm
            role={selectedRole || undefined}
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

export default RolesManagement;


