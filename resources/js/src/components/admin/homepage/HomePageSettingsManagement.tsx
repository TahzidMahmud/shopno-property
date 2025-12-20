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
  CardMedia,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { HomePageSetting, HomePageSettingFormData } from '../../../types/HomePage';
import { homePageSettingService } from '../../../services/homePageService';

const defaultSettings = [
  { key: 'home_description', label: 'Home Page Description Text' },
  { key: 'why_choose_us_video', label: 'Why Choose Us Video URL' },
  { key: 'call_to_action_image', label: 'Call to Action Background Image' },
  { key: 'call_to_action_background', label: 'Call to Action Background Image (Sky)' },
];

const HomePageSettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formData, setFormData] = useState<HomePageSettingFormData>({
    key: '',
    value: '',
    file: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await homePageSettingService.getAll();
      setSettings(data);
    } catch (error) {
      showNotification('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = (key: string) => {
    setEditingKey(key);
    setFormData({
      key,
      value: settings[key] || '',
      file: null,
    });
    const settingValue = settings[key];
    if (settingValue && (settingValue.startsWith('uploads/') || settingValue.startsWith('/storage/'))) {
      setPreview(settingValue.startsWith('/storage/') ? settingValue : `/storage/${settingValue}`);
    } else {
      setPreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingKey(null);
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!editingKey) return;
    
    try {
      // Check if setting exists
      try {
        await homePageSettingService.getByKey(editingKey);
        // Update existing
        await homePageSettingService.update(editingKey, formData);
        showNotification('Setting updated successfully');
      } catch {
        // Create new
        await homePageSettingService.create(formData);
        showNotification('Setting created successfully');
      }
      handleCloseDialog();
      loadSettings();
    } catch (error) {
      showNotification('Failed to save setting', 'error');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Home Page Settings Management</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Manage general settings for the home page
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Setting Key</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Value/Preview</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {defaultSettings.map((setting) => {
              const value = settings[setting.key] || 'Not set';
              const isImage = value && (value.includes('uploads/') || value.includes('/storage/') || value.includes('http'));
              
              return (
                <TableRow key={setting.key}>
                  <TableCell>{setting.key}</TableCell>
                  <TableCell>{setting.label}</TableCell>
                  <TableCell>
                    {isImage ? (
                      <Box sx={{ width: 100, height: 60 }}>
                        <CardMedia
                          component="img"
                          image={value.startsWith('/storage/') ? value : `/storage/${value}`}
                          alt={setting.key}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {value}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(setting.key)}><EditIcon /></IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Setting: {editingKey}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Key"
              fullWidth
              value={formData.key}
              disabled
            />
            {!formData.file && (
              <TextField
                label="Value (URL or Text)"
                fullWidth
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Enter URL or text value"
              />
            )}
            <Button variant="outlined" component="label">
              {formData.file ? 'Change File' : 'Upload File'}
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {formData.file && (
              <Button variant="text" onClick={() => {
                setFormData(prev => ({ ...prev, file: null }));
                setPreview(null);
              }}>
                Remove File
              </Button>
            )}
            {preview && (
              <Box sx={{ mt: 2 }}>
                <CardMedia
                  component="img"
                  image={preview}
                  alt="Preview"
                  sx={{ maxHeight: 200, objectFit: 'cover' }}
                />
              </Box>
            )}
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

export default HomePageSettingsManagement;


