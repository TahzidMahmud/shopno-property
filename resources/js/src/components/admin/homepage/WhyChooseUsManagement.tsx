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
import { WhyChooseUsFeature, WhyChooseUsFeatureFormData } from '../../../types/HomePage';
import { whyChooseUsFeatureService } from '../../../services/homePageService';

const iconOptions = [
  'CameraAlt', 'Chair', 'Description', 'AccessAlarm', 'Home', 'Business', 'LocationCity', 'Lightbulb'
];

const WhyChooseUsManagement: React.FC = () => {
  const [features, setFeatures] = useState<WhyChooseUsFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFeature, setEditingFeature] = useState<WhyChooseUsFeature | null>(null);
  const [formData, setFormData] = useState<WhyChooseUsFeatureFormData>({
    icon_name: 'CameraAlt',
    title: '',
    description: '',
    is_active: false,
    order: 0,
  });
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    setLoading(true);
    try {
      const data = await whyChooseUsFeatureService.getAll();
      setFeatures(data);
    } catch (error) {
      showNotification('Failed to load features', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = (feature?: WhyChooseUsFeature) => {
    if (feature) {
      setEditingFeature(feature);
      setFormData({
        icon_name: feature.icon_name,
        title: feature.title,
        description: feature.description,
        is_active: feature.is_active,
        order: feature.order,
      });
    } else {
      setEditingFeature(null);
      setFormData({
        icon_name: 'CameraAlt',
        title: '',
        description: '',
        is_active: false,
        order: features.length,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFeature(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingFeature) {
        await whyChooseUsFeatureService.update(editingFeature.id!, formData);
        showNotification('Feature updated successfully');
      } else {
        await whyChooseUsFeatureService.create(formData);
        showNotification('Feature created successfully');
      }
      handleCloseDialog();
      loadFeatures();
    } catch (error) {
      showNotification('Failed to save feature', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await whyChooseUsFeatureService.delete(id);
        showNotification('Feature deleted successfully');
        loadFeatures();
      } catch (error) {
        showNotification('Failed to delete feature', 'error');
      }
    }
  };

  if (loading && features.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Why Choose Us Features Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Feature
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Icon</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell>{feature.icon_name}</TableCell>
                <TableCell>{feature.title}</TableCell>
                <TableCell>{feature.description.substring(0, 50)}...</TableCell>
                <TableCell>{feature.order}</TableCell>
                <TableCell>{feature.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(feature)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(feature.id!)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingFeature ? 'Edit Feature' : 'Add Feature'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Icon Name</InputLabel>
              <Select
                value={formData.icon_name}
                onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                label="Icon Name"
              >
                {iconOptions.map(icon => (
                  <MenuItem key={icon} value={icon}>{icon}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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

export default WhyChooseUsManagement;


