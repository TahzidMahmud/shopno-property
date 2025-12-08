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
  CardMedia,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { HeaderNavigationLink, HeaderNavigationLinkFormData, HeaderDropdownItem, HeaderDropdownItemFormData } from '../../../types/HeaderFooter';
import { headerService, headerNavigationLinkService, headerDropdownItemService } from '../../../services/headerFooterService';

const HeaderManagement: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [navigationLinks, setNavigationLinks] = useState<HeaderNavigationLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [openDropdownDialog, setOpenDropdownDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<HeaderNavigationLink | null>(null);
  const [editingDropdown, setEditingDropdown] = useState<HeaderDropdownItem | null>(null);
  const [selectedNavigationLink, setSelectedNavigationLink] = useState<number | null>(null);
  const [linkFormData, setLinkFormData] = useState<HeaderNavigationLinkFormData>({
    label: '',
    url: '',
    order: 0,
    is_active: true,
    type: 'link',
  });
  const [dropdownFormData, setDropdownFormData] = useState<HeaderDropdownItemFormData>({
    navigation_link_id: 0,
    label: '',
    url: '',
    order: 0,
    is_active: true,
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [settingKey, setSettingKey] = useState('');
  const [settingValue, setSettingValue] = useState('');
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
      const data = await headerService.getAll();
      setSettings(data.settings || {});
      setNavigationLinks(data.navigation_links || []);
    } catch (error) {
      showNotification('Failed to load header data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenLinkDialog = (link?: HeaderNavigationLink) => {
    if (link) {
      setEditingLink(link);
      setLinkFormData({
        label: link.label,
        url: link.url,
        order: link.order,
        is_active: link.is_active,
        type: link.type,
      });
    } else {
      setEditingLink(null);
      setLinkFormData({
        label: '',
        url: '',
        order: navigationLinks.length,
        is_active: true,
        type: 'link',
      });
    }
    setOpenLinkDialog(true);
  };

  const handleOpenDropdownDialog = (navigationLinkId: number, item?: HeaderDropdownItem) => {
    setSelectedNavigationLink(navigationLinkId);
    if (item) {
      setEditingDropdown(item);
      setDropdownFormData({
        navigation_link_id: navigationLinkId,
        label: item.label,
        url: item.url,
        order: item.order,
        is_active: item.is_active,
      });
    } else {
      setEditingDropdown(null);
      setDropdownFormData({
        navigation_link_id: navigationLinkId,
        label: '',
        url: '',
        order: 0,
        is_active: true,
      });
    }
    setOpenDropdownDialog(true);
  };

  const handleOpenSettingsDialog = (key: string) => {
    setSettingKey(key);
    setSettingValue(settings[key] || '');
    setLogoPreview(key === 'logo' && settings[key] ? `/storage/${settings[key]}` : null);
    setLogoFile(null);
    setOpenSettingsDialog(true);
  };

  const handleSaveLink = async () => {
    try {
      if (editingLink) {
        await headerNavigationLinkService.update(editingLink.id!, linkFormData);
        showNotification('Navigation link updated successfully');
      } else {
        await headerNavigationLinkService.create(linkFormData);
        showNotification('Navigation link created successfully');
      }
      setOpenLinkDialog(false);
      loadData();
    } catch (error) {
      showNotification('Failed to save navigation link', 'error');
    }
  };

  const handleSaveDropdown = async () => {
    try {
      if (editingDropdown) {
        await headerDropdownItemService.update(editingDropdown.id!, dropdownFormData);
        showNotification('Dropdown item updated successfully');
      } else {
        await headerDropdownItemService.create(dropdownFormData);
        showNotification('Dropdown item created successfully');
      }
      setOpenDropdownDialog(false);
      loadData();
    } catch (error) {
      showNotification('Failed to save dropdown item', 'error');
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this navigation link?')) {
      try {
        await headerNavigationLinkService.delete(id);
        showNotification('Navigation link deleted successfully');
        loadData();
      } catch (error) {
        showNotification('Failed to delete navigation link', 'error');
      }
    }
  };

  const handleDeleteDropdown = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this dropdown item?')) {
      try {
        await headerDropdownItemService.delete(id);
        showNotification('Dropdown item deleted successfully');
        loadData();
      } catch (error) {
        showNotification('Failed to delete dropdown item', 'error');
      }
    }
  };

  const handleSaveSetting = async () => {
    try {
      await headerService.updateSetting(settingKey, settingValue, logoFile || undefined);
      showNotification('Setting updated successfully');
      setOpenSettingsDialog(false);
      loadData();
    } catch (error) {
      showNotification('Failed to update setting', 'error');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Header Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenLinkDialog()}>
          Add Navigation Link
        </Button>
      </Box>

      {/* Settings Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Header Settings</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Logo:</Typography>
              {settings.logo && (
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 40, objectFit: 'contain' }}
                  image={`/storage/${settings.logo}`}
                  alt="Logo"
                />
              )}
              <Button size="small" onClick={() => handleOpenSettingsDialog('logo')}>
                {settings.logo ? 'Change Logo' : 'Set Logo'}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>List Property Button Text:</Typography>
              <TextField
                size="small"
                value={settings.list_property_button_text || 'List Property'}
                onChange={(e) => {
                  setSettings({ ...settings, list_property_button_text: e.target.value });
                  headerService.updateSetting('list_property_button_text', e.target.value);
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Login Button Text:</Typography>
              <TextField
                size="small"
                value={settings.login_button_text || 'Log In'}
                onChange={(e) => {
                  setSettings({ ...settings, login_button_text: e.target.value });
                  headerService.updateSetting('login_button_text', e.target.value);
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation Links Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {navigationLinks.map((link) => (
              <React.Fragment key={link.id}>
                <TableRow>
                  <TableCell>{link.label}</TableCell>
                  <TableCell>{link.url}</TableCell>
                  <TableCell>{link.type}</TableCell>
                  <TableCell>{link.order}</TableCell>
                  <TableCell>{link.is_active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenLinkDialog(link)}>
                      <EditIcon />
                    </IconButton>
                    {link.type === 'dropdown' && (
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDropdownDialog(link.id!, undefined)}
                        color="primary"
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => handleDeleteLink(link.id!)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {link.type === 'dropdown' && link.dropdown_items && link.dropdown_items.map((item) => (
                  <TableRow key={item.id} sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ pl: 4 }}>└ {item.label}</TableCell>
                    <TableCell>{item.url}</TableCell>
                    <TableCell>Dropdown Item</TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>{item.is_active ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDropdownDialog(link.id!, item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteDropdown(item.id!)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Navigation Link Dialog */}
      <Dialog open={openLinkDialog} onClose={() => setOpenLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingLink ? 'Edit Navigation Link' : 'Add Navigation Link'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Label"
            value={linkFormData.label}
            onChange={(e) => setLinkFormData({ ...linkFormData, label: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="URL"
            value={linkFormData.url}
            onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={linkFormData.type}
              onChange={(e) => setLinkFormData({ ...linkFormData, type: e.target.value as 'link' | 'dropdown' })}
            >
              <MenuItem value="link">Link</MenuItem>
              <MenuItem value="dropdown">Dropdown</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Order"
            type="number"
            value={linkFormData.order}
            onChange={(e) => setLinkFormData({ ...linkFormData, order: parseInt(e.target.value) })}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={linkFormData.is_active}
                onChange={(e) => setLinkFormData({ ...linkFormData, is_active: e.target.checked })}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLinkDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveLink} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dropdown Item Dialog */}
      <Dialog open={openDropdownDialog} onClose={() => setOpenDropdownDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDropdown ? 'Edit Dropdown Item' : 'Add Dropdown Item'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Label"
            value={dropdownFormData.label}
            onChange={(e) => setDropdownFormData({ ...dropdownFormData, label: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="URL"
            value={dropdownFormData.url}
            onChange={(e) => setDropdownFormData({ ...dropdownFormData, url: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Order"
            type="number"
            value={dropdownFormData.order}
            onChange={(e) => setDropdownFormData({ ...dropdownFormData, order: parseInt(e.target.value) })}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={dropdownFormData.is_active}
                onChange={(e) => setDropdownFormData({ ...dropdownFormData, is_active: e.target.checked })}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDropdownDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveDropdown} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={openSettingsDialog} onClose={() => setOpenSettingsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update {settingKey}</DialogTitle>
        <DialogContent>
          {settingKey === 'logo' ? (
            <>
              {logoPreview && (
                <CardMedia
                  component="img"
                  sx={{ width: '100%', maxHeight: 200, objectFit: 'contain', mb: 2 }}
                  image={logoPreview}
                  alt="Logo Preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ marginBottom: 16 }}
              />
            </>
          ) : (
            <TextField
              fullWidth
              label="Value"
              value={settingValue}
              onChange={(e) => setSettingValue(e.target.value)}
              margin="normal"
              multiline={settingKey.includes('address') || settingKey.includes('description')}
              rows={settingKey.includes('address') || settingKey.includes('description') ? 4 : 1}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettingsDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveSetting} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default HeaderManagement;

