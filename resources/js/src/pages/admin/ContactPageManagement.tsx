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
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ContactPageKeyTransport, ContactPageKeyTransportFormData } from '../../types/ContactPage';
import { contactPageService, contactPageKeyTransportService } from '../../services/contactPageService';

const ContactPageManagement: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [keyTransports, setKeyTransports] = useState<ContactPageKeyTransport[]>([]);
  const [loading, setLoading] = useState(false);
  const [openTransportDialog, setOpenTransportDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [editingTransport, setEditingTransport] = useState<ContactPageKeyTransport | null>(null);
  const [transportFormData, setTransportFormData] = useState<ContactPageKeyTransportFormData>({
    name: '',
    icon: 'store',
    distance: '',
    order: 0,
    is_active: true,
  });
  const [settingKey, setSettingKey] = useState('');
  const [settingValue, setSettingValue] = useState('');
  const [settingFile, setSettingFile] = useState<File | null>(null);
  const [settingPreview, setSettingPreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await contactPageService.getAll();
      setSettings(data.settings || {});
      setKeyTransports(data.key_transports || []);
    } catch (error) {
      showNotification('Failed to load contact page data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenTransportDialog = (transport?: ContactPageKeyTransport) => {
    if (transport) {
      setEditingTransport(transport);
      setTransportFormData({
        name: transport.name,
        icon: transport.icon,
        distance: transport.distance,
        order: transport.order,
        is_active: transport.is_active,
      });
    } else {
      setEditingTransport(null);
      setTransportFormData({
        name: '',
        icon: 'store',
        distance: '',
        order: keyTransports.length,
        is_active: true,
      });
    }
    setOpenTransportDialog(true);
  };

  const handleCloseTransportDialog = () => {
    setOpenTransportDialog(false);
    setEditingTransport(null);
    setTransportFormData({
      name: '',
      icon: 'store',
      distance: '',
      order: 0,
      is_active: true,
    });
  };

  const handleSaveTransport = async () => {
    try {
      if (editingTransport && editingTransport.id) {
        await contactPageKeyTransportService.update(editingTransport.id, transportFormData);
        showNotification('Key transport updated successfully');
      } else {
        await contactPageKeyTransportService.create(transportFormData);
        showNotification('Key transport created successfully');
      }
      handleCloseTransportDialog();
      loadData();
    } catch (error) {
      showNotification('Failed to save key transport', 'error');
    }
  };

  const handleDeleteTransport = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this key transport?')) {
      try {
        await contactPageKeyTransportService.delete(id);
        showNotification('Key transport deleted successfully');
        loadData();
      } catch (error) {
        showNotification('Failed to delete key transport', 'error');
      }
    }
  };

  const handleOpenSettingsDialog = (key: string, value: string = '') => {
    setSettingKey(key);
    setSettingValue(value);
    setSettingFile(null);
    setSettingPreview(null);
    setOpenSettingsDialog(true);
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
    setSettingKey('');
    setSettingValue('');
    setSettingFile(null);
    setSettingPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSettingFile(file);
      setSettingPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSetting = async () => {
    try {
      await contactPageService.updateSetting({
        key: settingKey,
        value: settingValue,
        file: settingFile,
      });
      showNotification('Setting updated successfully');
      handleCloseSettingsDialog();
      loadData();
    } catch (error) {
      showNotification('Failed to update setting', 'error');
    }
  };

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Contact Page Management
      </Typography>

      {/* Settings Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Page Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('hero_title', settings.hero_title || 'Contact Us')}
            >
              Edit Hero Title
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('hero_background_image', settings.hero_background_image || '')}
            >
              Edit Hero Background Image
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('section_title', settings.section_title || 'Get In Touch')}
            >
              Edit Section Title
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('form_heading', settings.form_heading || 'Enquiry')}
            >
              Edit Form Heading
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('form_description', settings.form_description || '')}
            >
              Edit Form Description
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('form_email', settings.form_email || 'contact@example.com')}
            >
              Edit Form Email
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('address', settings.address || '')}
            >
              Edit Address
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('phone', settings.phone || '+8801844-646633')}
            >
              Edit Phone
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('email', settings.email || 'info.shopnoproperty@gmail.com')}
            >
              Edit Email
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('map_address', settings.map_address || '')}
            >
              Edit Map Address
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('map_latitude', settings.map_latitude || '')}
            >
              Edit Map Latitude
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenSettingsDialog('map_longitude', settings.map_longitude || '')}
            >
              Edit Map Longitude
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Key Transports Section */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Key Transports</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenTransportDialog()}
          >
            Add Key Transport
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Distance</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keyTransports.map((transport) => (
                <TableRow key={transport.id}>
                  <TableCell>{transport.name}</TableCell>
                  <TableCell>{transport.icon}</TableCell>
                  <TableCell>{transport.distance}</TableCell>
                  <TableCell>{transport.order}</TableCell>
                  <TableCell>{transport.is_active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenTransportDialog(transport)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => transport.id && handleDeleteTransport(transport.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Key Transport Dialog */}
      <Dialog open={openTransportDialog} onClose={handleCloseTransportDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTransport ? 'Edit Key Transport' : 'Add Key Transport'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={transportFormData.name}
              onChange={(e) => setTransportFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>Icon</InputLabel>
              <Select
                value={transportFormData.icon}
                onChange={(e) => setTransportFormData(prev => ({ ...prev, icon: e.target.value }))}
                label="Icon"
              >
                <MenuItem value="airplane">Airplane</MenuItem>
                <MenuItem value="train">Train</MenuItem>
                <MenuItem value="school">School</MenuItem>
                <MenuItem value="hospital">Hospital</MenuItem>
                <MenuItem value="bank">Bank</MenuItem>
                <MenuItem value="store">Store</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Distance"
              fullWidth
              value={transportFormData.distance}
              onChange={(e) => setTransportFormData(prev => ({ ...prev, distance: e.target.value }))}
            />
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={transportFormData.order}
              onChange={(e) => setTransportFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={transportFormData.is_active}
                  onChange={(e) => setTransportFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTransportDialog}>Cancel</Button>
          <Button onClick={handleSaveTransport} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={openSettingsDialog} onClose={handleCloseSettingsDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Setting: {settingKey}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {settingKey.includes('image') || settingKey.includes('background') ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ marginBottom: 16 }}
                />
                {(settingPreview || getImageUrl(settingValue)) && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={settingPreview || getImageUrl(settingValue) || ''}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: 200 }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <TextField
                label="Value"
                fullWidth
                multiline={settingKey === 'address' || settingKey === 'form_description' || settingKey === 'map_address'}
                rows={settingKey === 'address' || settingKey === 'form_description' || settingKey === 'map_address' ? 4 : 1}
                value={settingValue}
                onChange={(e) => setSettingValue(e.target.value)}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettingsDialog}>Cancel</Button>
          <Button onClick={handleSaveSetting} variant="contained">Save</Button>
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

export default ContactPageManagement;

