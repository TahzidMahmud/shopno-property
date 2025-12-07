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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { SearchOption, SearchOptionFormData } from '../../../types/HomePage';
import { searchOptionService } from '../../../services/homePageService';

const categoryOptions = ['project_status', 'property_type', 'location', 'budget'];

const SearchOptionsManagement: React.FC = () => {
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<SearchOption | null>(null);
  const [formData, setFormData] = useState<SearchOptionFormData>({
    category: 'project_status',
    label: '',
    value: '',
    order: 0,
    is_active: true,
  });
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    setLoading(true);
    try {
      const data = await searchOptionService.getAll();
      setOptions(data);
    } catch (error) {
      showNotification('Failed to load options', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = (option?: SearchOption) => {
    if (option) {
      setEditingOption(option);
      setFormData({
        category: option.category,
        label: option.label,
        value: option.value,
        order: option.order,
        is_active: option.is_active,
      });
    } else {
      setEditingOption(null);
      setFormData({
        category: 'project_status',
        label: '',
        value: '',
        order: options.filter(o => o.category === 'project_status').length,
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOption(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingOption) {
        await searchOptionService.update(editingOption.id!, formData);
        showNotification('Option updated successfully');
      } else {
        await searchOptionService.create(formData);
        showNotification('Option created successfully');
      }
      handleCloseDialog();
      loadOptions();
    } catch (error) {
      showNotification('Failed to save option', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      try {
        await searchOptionService.delete(id);
        showNotification('Option deleted successfully');
        loadOptions();
      } catch (error) {
        showNotification('Failed to delete option', 'error');
      }
    }
  };

  if (loading && options.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Search Options Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Option
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((option) => (
              <TableRow key={option.id}>
                <TableCell>{option.category}</TableCell>
                <TableCell>{option.label}</TableCell>
                <TableCell>{option.value}</TableCell>
                <TableCell>{option.order}</TableCell>
                <TableCell>{option.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(option)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(option.id!)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingOption ? 'Edit Option' : 'Add Option'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                label="Category"
              >
                {categoryOptions.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Label"
              fullWidth
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
            />
            <TextField
              label="Value"
              fullWidth
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            />
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

export default SearchOptionsManagement;


