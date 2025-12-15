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
  Avatar,
  Chip,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { PropertyType } from '../../services/propertyTypeService';

interface PropertyTypeListProps {
  propertyTypes: PropertyType[];
  loading?: boolean;
  onEdit: (propertyType: PropertyType) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const PropertyTypeList: React.FC<PropertyTypeListProps> = ({
  propertyTypes,
  loading = false,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    propertyType: PropertyType | null;
  }>({ open: false, propertyType: null });

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const handleDeleteClick = (propertyType: PropertyType) => {
    setDeleteDialog({ open: true, propertyType });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.propertyType?.id) {
      onDelete(deleteDialog.propertyType.id);
      setDeleteDialog({ open: false, propertyType: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, propertyType: null });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Property Types Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ textTransform: 'none' }}
        >
          Add Property Type
        </Button>
      </Box>

      {propertyTypes.length === 0 && !loading ? (
        <Alert severity="info">No property types found. Click "Add Property Type" to create one.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Icon</strong></TableCell>
                <TableCell><strong>Label</strong></TableCell>
                <TableCell><strong>Type Value</strong></TableCell>
                <TableCell><strong>Order</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {propertyTypes.map((propertyType) => (
                <TableRow key={propertyType.id} hover>
                  <TableCell>
                    {getImageUrl(propertyType.icon_image) ? (
                      <Avatar
                        src={getImageUrl(propertyType.icon_image) || undefined}
                        alt={propertyType.name}
                        sx={{ width: 40, height: 40 }}
                        variant="square"
                      >
                        {propertyType.name.charAt(0).toUpperCase()}
                      </Avatar>
                    ) : (
                      <Avatar
                        sx={{ width: 40, height: 40, bgcolor: '#e0e0e0' }}
                        variant="square"
                      >
                        {propertyType.name.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>{propertyType.name}</TableCell>
                  <TableCell>{propertyType.type_value}</TableCell>
                  <TableCell>{propertyType.order || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={propertyType.is_active ? 'Active' : 'Inactive'}
                      color={propertyType.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(propertyType)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(propertyType)}
                      color="error"
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
        <DialogTitle>Delete Property Type</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.propertyType?.name}"? This action cannot be undone.
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

export default PropertyTypeList;

