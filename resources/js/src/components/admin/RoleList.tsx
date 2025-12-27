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
} from '@mui/icons-material';
import { Role } from '../../services/roleService';

interface RoleListProps {
  roles: Role[];
  loading?: boolean;
  onEdit: (role: Role) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const RoleList: React.FC<RoleListProps> = ({
  roles,
  loading = false,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    role: Role | null;
  }>({ open: false, role: null });

  const handleDeleteClick = (role: Role) => {
    setDeleteDialog({ open: true, role });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.role?.id) {
      onDelete(deleteDialog.role.id);
      setDeleteDialog({ open: false, role: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, role: null });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Roles Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ textTransform: 'none' }}
        >
          Add Role
        </Button>
      </Box>

      {roles.length === 0 && !loading ? (
        <Alert severity="info">No roles found. Click "Add Role" to create one.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Permissions</strong></TableCell>
                <TableCell><strong>Created At</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {role.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {role.permissions && role.permissions.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {role.permissions.map((permission) => (
                          <Chip
                            key={permission.id}
                            label={permission.name}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No permissions
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {role.created_at
                      ? new Date(role.created_at).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(role)}
                      color="primary"
                      title="Edit Role"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(role)}
                      color="error"
                      title="Delete Role"
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
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the role "{deleteDialog.role?.name}"? 
            This action cannot be undone. Users with this role will lose access to the associated permissions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleList;


