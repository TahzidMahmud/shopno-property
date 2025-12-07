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
  Snackbar,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { InvestmentBenefit, InvestmentBenefitFormData } from '../../../types/HomePage';
import { investmentBenefitService } from '../../../services/homePageService';

const iconOptions = [
  'BarChart', 'Storage', 'Hub', 'ArrowUpward', 'TrendingUp', 'AccountBalance', 'ShowChart'
];

const InvestmentBenefitsManagement: React.FC = () => {
  const [benefits, setBenefits] = useState<InvestmentBenefit[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<InvestmentBenefit | null>(null);
  const [formData, setFormData] = useState<InvestmentBenefitFormData>({
    icon_name: 'BarChart',
    title: '',
    description: '',
    order: 0,
  });
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadBenefits();
  }, []);

  const loadBenefits = async () => {
    setLoading(true);
    try {
      const data = await investmentBenefitService.getAll();
      setBenefits(data);
    } catch (error) {
      showNotification('Failed to load benefits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = (benefit?: InvestmentBenefit) => {
    if (benefit) {
      setEditingBenefit(benefit);
      setFormData({
        icon_name: benefit.icon_name,
        title: benefit.title,
        description: benefit.description,
        order: benefit.order,
      });
    } else {
      setEditingBenefit(null);
      setFormData({
        icon_name: 'BarChart',
        title: '',
        description: '',
        order: benefits.length,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBenefit(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingBenefit) {
        await investmentBenefitService.update(editingBenefit.id!, formData);
        showNotification('Benefit updated successfully');
      } else {
        await investmentBenefitService.create(formData);
        showNotification('Benefit created successfully');
      }
      handleCloseDialog();
      loadBenefits();
    } catch (error) {
      showNotification('Failed to save benefit', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this benefit?')) {
      try {
        await investmentBenefitService.delete(id);
        showNotification('Benefit deleted successfully');
        loadBenefits();
      } catch (error) {
        showNotification('Failed to delete benefit', 'error');
      }
    }
  };

  if (loading && benefits.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Investment Benefits Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Benefit
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {benefits.map((benefit) => (
              <TableRow key={benefit.id}>
                <TableCell>{benefit.icon_name}</TableCell>
                <TableCell>{benefit.title}</TableCell>
                <TableCell>{benefit.description.substring(0, 50)}...</TableCell>
                <TableCell>{benefit.order}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(benefit)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(benefit.id!)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingBenefit ? 'Edit Benefit' : 'Add Benefit'}</DialogTitle>
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

export default InvestmentBenefitsManagement;


