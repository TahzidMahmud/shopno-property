import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  Button,
} from '@mui/material';
import UserList from '../../components/admin/UserList';
import UserForm from '../../components/admin/UserForm';
import UserPermissionsComponent from '../../components/admin/UserPermissions';
import { User, UserFormData } from '../../services/userService';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

type ViewMode = 'list' | 'form' | 'permissions';

const UsersManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [permissionUserId, setPermissionUserId] = useState<number | null>(null);
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
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load users';
      showNotification(errorMessage, 'error');
      setUsers([]);
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
    setSelectedUser(null);
    setViewMode('form');
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setViewMode('form');
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      showNotification('User deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      showNotification(errorMessage, 'error');
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (id: number) => {
    setLoading(true);
    try {
      const updatedUser = await userService.ban(id);
      setUsers(prev =>
        prev.map(u => u.id === id ? updatedUser : u)
      );
      showNotification('User banned successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to ban user';
      showNotification(errorMessage, 'error');
      console.error('Error banning user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async (id: number) => {
    setLoading(true);
    try {
      const updatedUser = await userService.unban(id);
      setUsers(prev =>
        prev.map(u => u.id === id ? updatedUser : u)
      );
      showNotification('User unbanned successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to unban user';
      showNotification(errorMessage, 'error');
      console.error('Error unbanning user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: UserFormData) => {
    setSubmitLoading(true);
    try {
      if (selectedUser) {
        const updatedUser = await userService.update(selectedUser.id!, data);
        setUsers(prev =>
          prev.map(u => u.id === selectedUser.id ? updatedUser : u)
        );
        showNotification('User updated successfully');
      } else {
        const newUser = await userService.create(data);
        setUsers(prev => [...prev, newUser]);
        showNotification('User created successfully');
      }
      setViewMode('list');
      setSelectedUser(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
        (selectedUser ? 'Failed to update user' : 'Failed to create user');
      showNotification(errorMessage, 'error');
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedUser(null);
  };

  const handleManagePermissions = (user: User) => {
    setPermissionUserId(user.id!);
    setViewMode('permissions');
  };

  const handlePermissionsBack = () => {
    setViewMode('list');
    setPermissionUserId(null);
    loadUsers(); // Reload users to get updated permissions
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
          <UserList
            users={users}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBan={handleBan}
            onUnban={handleUnban}
            onManagePermissions={handleManagePermissions}
            currentUserId={currentUser?.id}
          />
        )}

        {viewMode === 'form' && (
          <UserForm
            user={selectedUser || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={submitLoading}
          />
        )}

        {viewMode === 'permissions' && permissionUserId && (
          <Box sx={{ p: 3 }}>
            <UserPermissionsComponent
              userId={permissionUserId}
              onUpdate={handlePermissionsBack}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handlePermissionsBack}>
                Back to Users
              </Button>
            </Box>
          </Box>
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

export default UsersManagement;


