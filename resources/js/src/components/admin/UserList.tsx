import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { User } from '../../services/userService';

interface UserListProps {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onBan: (id: number) => void;
  onUnban: (id: number) => void;
  onAdd: () => void;
  onManagePermissions?: (user: User) => void;
  currentUserId?: number;
}

const UserList: React.FC<UserListProps> = ({
  users,
  loading = false,
  onEdit,
  onDelete,
  onBan,
  onUnban,
  onAdd,
  onManagePermissions,
  currentUserId,
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

  const [banDialog, setBanDialog] = useState<{
    open: boolean;
    user: User | null;
    action: 'ban' | 'unban';
  }>({ open: false, user: null, action: 'ban' });

  const handleDeleteClick = (user: User) => {
    setDeleteDialog({ open: true, user });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.user?.id) {
      onDelete(deleteDialog.user.id);
      setDeleteDialog({ open: false, user: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, user: null });
  };

  const handleBanClick = (user: User) => {
    setBanDialog({ open: true, user, action: user.is_banned ? 'unban' : 'ban' });
  };

  const handleBanConfirm = () => {
    if (banDialog.user?.id) {
      if (banDialog.action === 'ban') {
        onBan(banDialog.user.id);
      } else {
        onUnban(banDialog.user.id);
      }
      setBanDialog({ open: false, user: null, action: 'ban' });
    }
  };

  const handleBanCancel = () => {
    setBanDialog({ open: false, user: null, action: 'ban' });
  };

  const isCurrentUser = (userId?: number) => {
    return currentUserId && userId === currentUserId;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Users Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ textTransform: 'none' }}
        >
          Add User
        </Button>
      </Box>

      {users.length === 0 && !loading ? (
        <Alert severity="info">No users found. Click "Add User" to create one.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Created At</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_banned ? 'Banned' : 'Active'}
                      color={user.is_banned ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(user)}
                      color="primary"
                      disabled={isCurrentUser(user.id)}
                      title="Edit User"
                    >
                      <EditIcon />
                    </IconButton>
                    {onManagePermissions && (
                      <IconButton
                        size="small"
                        onClick={() => onManagePermissions(user)}
                        color="secondary"
                        title="Manage Permissions"
                      >
                        <SecurityIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleBanClick(user)}
                      color={user.is_banned ? 'success' : 'warning'}
                      disabled={isCurrentUser(user.id)}
                      title={user.is_banned ? 'Unban User' : 'Ban User'}
                    >
                      {user.is_banned ? <CheckCircleIcon /> : <BlockIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(user)}
                      color="error"
                      disabled={isCurrentUser(user.id)}
                      title="Delete User"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.user?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={banDialog.open} onClose={handleBanCancel}>
        <DialogTitle>
          {banDialog.action === 'ban' ? 'Ban User' : 'Unban User'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {banDialog.action} "{banDialog.user?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBanCancel}>Cancel</Button>
          <Button
            onClick={handleBanConfirm}
            color={banDialog.action === 'ban' ? 'warning' : 'success'}
            variant="contained"
          >
            {banDialog.action === 'ban' ? 'Ban' : 'Unban'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;

