import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { projectsPageService, ProjectsPageSettingFormData } from '../../services/projectsPageService';

const ProjectsPageManagement: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
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
      const data = await projectsPageService.getAll();
      setSettings(data || {});
    } catch (error) {
      showNotification('Failed to load projects page data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenSettingsDialog = (key: string, currentValue: string = '') => {
    setSettingKey(key);
    setSettingValue(currentValue);
    setSettingFile(null);
    const settingValue = settings[key];
    if (settingValue && (settingValue.startsWith('uploads/') || settingValue.startsWith('/storage/'))) {
      setSettingPreview(settingValue.startsWith('/storage/') ? settingValue : `/storage/${settingValue}`);
    } else {
      setSettingPreview(null);
    }
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
    const file = e.target.files?.[0] || null;
    setSettingFile(file);
    if (file) {
      setSettingPreview(URL.createObjectURL(file));
      setSettingValue(''); // Clear text value when file is selected
    }
  };

  const handleSaveSetting = async () => {
    try {
      const formData: ProjectsPageSettingFormData = {
        key: settingKey,
        value: settingFile ? undefined : settingValue,
        file: settingFile,
      };
      await projectsPageService.updateSetting(formData);
      showNotification('Setting updated successfully');
      handleCloseSettingsDialog();
      loadData();
    } catch (error) {
      showNotification('Failed to update setting', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Projects Page Management
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
              onClick={() => handleOpenSettingsDialog('hero_background_image', settings.hero_background_image || '')}
            >
              Edit Hero Background Image
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Settings Dialog */}
      <Dialog open={openSettingsDialog} onClose={handleCloseSettingsDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Setting</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {settingKey === 'hero_background_image' ? (
              <>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button variant="outlined" component="span" fullWidth>
                    Upload Image
                  </Button>
                </label>
                {settingPreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={settingPreview}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <TextField
                label="Value"
                value={settingValue}
                onChange={(e) => setSettingValue(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettingsDialog}>Cancel</Button>
          <Button onClick={handleSaveSetting} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectsPageManagement;

