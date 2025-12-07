import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { PropertyType, PropertyTypeFormData } from '../../../types/HomePage';
import { propertyTypeService } from '../../../services/homePageService';
import { propertyService } from '../../../services/propertyService';

// Icon options mapping
const iconOptions = [
  { value: 'ApartmentIcon', label: 'Apartment' },
  { value: 'HouseIcon', label: 'House' },
  { value: 'StoreIcon', label: 'Store/Commercial' },
  { value: 'LandscapeIcon', label: 'Landscape/Land' },
  { value: 'HotelIcon', label: 'Hotel' },
  { value: 'HolidayVillageIcon', label: 'Holiday Village/Resort' },
];

const PropertyTypesManagement: React.FC = () => {
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingType, setEditingType] = useState<PropertyType | null>(null);
  const [availablePropertyTypes, setAvailablePropertyTypes] = useState<string[]>([]);
  const [formData, setFormData] = useState<PropertyTypeFormData>({
    name: '',
    type_value: '',
    icon_name: 'HouseIcon',
    order: 0,
    is_active: true,
  });
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadTypes();
    loadAvailablePropertyTypes();
  }, []);

  const loadTypes = async () => {
    setLoading(true);
    try {
      const data = await propertyTypeService.getAll();
      setTypes(data);
    } catch (error) {
      showNotification('Failed to load property types', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailablePropertyTypes = async () => {
    try {
      const properties = await propertyService.getAll();
      const uniqueTypes = Array.from(new Set(properties.map(p => p.type).filter(Boolean))) as string[];
      setAvailablePropertyTypes(uniqueTypes);
    } catch (error) {
      console.error('Error loading property types:', error);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = (type?: PropertyType) => {
    if (type) {
      setEditingType(type);
      setFormData({
        name: type.name,
        type_value: type.type_value,
        icon_name: type.icon_name,
        order: type.order,
        is_active: type.is_active,
      });
    } else {
      setEditingType(null);
      setFormData({
        name: '',
        type_value: '',
        icon_name: 'HouseIcon',
        order: types.length,
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingType(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingType) {
        await propertyTypeService.update(editingType.id!, formData);
        showNotification('Property type updated successfully');
      } else {
        await propertyTypeService.create(formData);
        showNotification('Property type created successfully');
      }
      handleCloseDialog();
      loadTypes();
    } catch (error) {
      showNotification('Failed to save property type', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this property type?')) {
      try {
        await propertyTypeService.delete(id);
        showNotification('Property type deleted successfully');
        loadTypes();
      } catch (error) {
        showNotification('Failed to delete property type', 'error');
      }
    }
  };

  if (loading && types.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Property Types Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Property Type
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type Value</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.type_value}</TableCell>
                <TableCell>{type.icon_name}</TableCell>
                <TableCell>{type.order}</TableCell>
                <TableCell>{type.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(type)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(type.id!)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingType ? 'Edit Property Type' : 'Add Property Type'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Display Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Modern Villa, Apartment"
            />
            <FormControl fullWidth>
              <InputLabel>Type Value</InputLabel>
              <Select
                value={formData.type_value}
                label="Type Value"
                onChange={(e) => setFormData(prev => ({ ...prev, type_value: e.target.value }))}
              >
                {availablePropertyTypes.map((type) => (
                  <MenuItem key={type} value={type.toLowerCase()}>
                    {type}
                  </MenuItem>
                ))}
                <MenuItem value={formData.type_value || ''}>
                  {formData.type_value || 'Custom (enter manually)'}
                </MenuItem>
              </Select>
            </FormControl>
            {(!availablePropertyTypes.includes(formData.type_value) && formData.type_value) && (
              <TextField
                label="Custom Type Value"
                fullWidth
                value={formData.type_value}
                onChange={(e) => setFormData(prev => ({ ...prev, type_value: e.target.value.toLowerCase() }))}
                placeholder="e.g., villa, apartment, commercial"
                helperText="Enter the value that matches property.type in the database"
              />
            )}
            <FormControl fullWidth>
              <InputLabel>Icon</InputLabel>
              <Select
                value={formData.icon_name}
                label="Icon"
                onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
              >
                {iconOptions.map((icon) => (
                  <MenuItem key={icon.value} value={icon.value}>
                    {icon.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PropertyTypesManagement;

