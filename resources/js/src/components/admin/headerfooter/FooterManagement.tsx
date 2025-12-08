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
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  FooterQuickLink,
  FooterQuickLinkFormData,
  FooterDiscoverLink,
  FooterDiscoverLinkFormData,
  FooterSocialLink,
  FooterSocialLinkFormData,
} from '../../../types/HeaderFooter';
import {
  footerService,
  footerQuickLinkService,
  footerDiscoverLinkService,
  footerSocialLinkService,
} from '../../../services/headerFooterService';

const FooterManagement: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [quickLinks, setQuickLinks] = useState<FooterQuickLink[]>([]);
  const [discoverLinks, setDiscoverLinks] = useState<FooterDiscoverLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<FooterSocialLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [openQuickLinkDialog, setOpenQuickLinkDialog] = useState(false);
  const [openDiscoverLinkDialog, setOpenDiscoverLinkDialog] = useState(false);
  const [openSocialLinkDialog, setOpenSocialLinkDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [editingQuickLink, setEditingQuickLink] = useState<FooterQuickLink | null>(null);
  const [editingDiscoverLink, setEditingDiscoverLink] = useState<FooterDiscoverLink | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<FooterSocialLink | null>(null);
  const [quickLinkFormData, setQuickLinkFormData] = useState<FooterQuickLinkFormData>({
    label: '',
    url: '',
    order: 0,
    is_active: true,
  });
  const [discoverLinkFormData, setDiscoverLinkFormData] = useState<FooterDiscoverLinkFormData>({
    label: '',
    url: '',
    order: 0,
    is_active: true,
  });
  const [socialLinkFormData, setSocialLinkFormData] = useState<FooterSocialLinkFormData>({
    platform: 'facebook',
    url: '',
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
      const data = await footerService.getAll();
      setSettings(data.settings || {});
      setQuickLinks(data.quick_links || []);
      setDiscoverLinks(data.discover_links || []);
      setSocialLinks(data.social_links || []);
    } catch (error) {
      showNotification('Failed to load footer data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenQuickLinkDialog = (link?: FooterQuickLink) => {
    if (link) {
      setEditingQuickLink(link);
      setQuickLinkFormData({
        label: link.label,
        url: link.url,
        order: link.order,
        is_active: link.is_active,
      });
    } else {
      setEditingQuickLink(null);
      setQuickLinkFormData({
        label: '',
        url: '',
        order: quickLinks.length,
        is_active: true,
      });
    }
    setOpenQuickLinkDialog(true);
  };

  const handleOpenDiscoverLinkDialog = (link?: FooterDiscoverLink) => {
    if (link) {
      setEditingDiscoverLink(link);
      setDiscoverLinkFormData({
        label: link.label,
        url: link.url,
        order: link.order,
        is_active: link.is_active,
      });
    } else {
      setEditingDiscoverLink(null);
      setDiscoverLinkFormData({
        label: '',
        url: '',
        order: discoverLinks.length,
        is_active: true,
      });
    }
    setOpenDiscoverLinkDialog(true);
  };

  const handleOpenSocialLinkDialog = (link?: FooterSocialLink) => {
    if (link) {
      setEditingSocialLink(link);
      setSocialLinkFormData({
        platform: link.platform,
        url: link.url,
        is_active: link.is_active,
      });
    } else {
      setEditingSocialLink(null);
      setSocialLinkFormData({
        platform: 'facebook',
        url: '',
        is_active: true,
      });
    }
    setOpenSocialLinkDialog(true);
  };

  const handleOpenSettingsDialog = (key: string) => {
    setSettingKey(key);
    setSettingValue(settings[key] || '');
    setLogoPreview(key === 'logo' && settings[key] ? `/storage/${settings[key]}` : null);
    setLogoFile(null);
    setOpenSettingsDialog(true);
  };

  const handleSaveQuickLink = async () => {
    try {
      if (editingQuickLink) {
        await footerQuickLinkService.update(editingQuickLink.id!, quickLinkFormData);
        showNotification('Quick link updated successfully');
      } else {
        await footerQuickLinkService.create(quickLinkFormData);
        showNotification('Quick link created successfully');
      }
      setOpenQuickLinkDialog(false);
      loadData();
    } catch (error) {
      showNotification('Failed to save quick link', 'error');
    }
  };

  const handleSaveDiscoverLink = async () => {
    try {
      if (editingDiscoverLink) {
        await footerDiscoverLinkService.update(editingDiscoverLink.id!, discoverLinkFormData);
        showNotification('Discover link updated successfully');
      } else {
        await footerDiscoverLinkService.create(discoverLinkFormData);
        showNotification('Discover link created successfully');
      }
      setOpenDiscoverLinkDialog(false);
      loadData();
    } catch (error) {
      showNotification('Failed to save discover link', 'error');
    }
  };

  const handleSaveSocialLink = async () => {
    try {
      if (editingSocialLink) {
        await footerSocialLinkService.update(editingSocialLink.id!, socialLinkFormData);
        showNotification('Social link updated successfully');
      } else {
        await footerSocialLinkService.create(socialLinkFormData);
        showNotification('Social link created successfully');
      }
      setOpenSocialLinkDialog(false);
      loadData();
    } catch (error) {
      showNotification('Failed to save social link', 'error');
    }
  };

  const handleDeleteQuickLink = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this quick link?')) {
      try {
        await footerQuickLinkService.delete(id);
        showNotification('Quick link deleted successfully');
        loadData();
      } catch (error) {
        showNotification('Failed to delete quick link', 'error');
      }
    }
  };

  const handleDeleteDiscoverLink = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this discover link?')) {
      try {
        await footerDiscoverLinkService.delete(id);
        showNotification('Discover link deleted successfully');
        loadData();
      } catch (error) {
        showNotification('Failed to delete discover link', 'error');
      }
    }
  };

  const handleDeleteSocialLink = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this social link?')) {
      try {
        await footerSocialLinkService.delete(id);
        showNotification('Social link deleted successfully');
        loadData();
      } catch (error) {
        showNotification('Failed to delete social link', 'error');
      }
    }
  };

  const handleSaveSetting = async () => {
    try {
      await footerService.updateSetting(settingKey, settingValue, logoFile || undefined);
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
      <Typography variant="h5" sx={{ mb: 3 }}>Footer Management</Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
          <Tab label="Settings" />
          <Tab label="Quick Links" />
          <Tab label="Discover Links" />
          <Tab label="Social Links" />
        </Tabs>
      </Paper>

      {/* Settings Tab */}
      {currentTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Footer Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={settings.address || ''}
                onChange={(e) => {
                  setSettings({ ...settings, address: e.target.value });
                  footerService.updateSetting('address', e.target.value);
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={settings.phone || ''}
                onChange={(e) => {
                  setSettings({ ...settings, phone: e.target.value });
                  footerService.updateSetting('phone', e.target.value);
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={settings.email || ''}
                onChange={(e) => {
                  setSettings({ ...settings, email: e.target.value });
                  footerService.updateSetting('email', e.target.value);
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Copyright Text"
                value={settings.copyright || ''}
                onChange={(e) => {
                  setSettings({ ...settings, copyright: e.target.value });
                  footerService.updateSetting('copyright', e.target.value);
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Privacy Policy URL"
                value={settings.privacy_policy_url || ''}
                onChange={(e) => {
                  setSettings({ ...settings, privacy_policy_url: e.target.value });
                  footerService.updateSetting('privacy_policy_url', e.target.value);
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Terms & Conditions URL"
                value={settings.terms_url || ''}
                onChange={(e) => {
                  setSettings({ ...settings, terms_url: e.target.value });
                  footerService.updateSetting('terms_url', e.target.value);
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Call to Action Phone"
                value={settings.cta_phone || ''}
                onChange={(e) => {
                  setSettings({ ...settings, cta_phone: e.target.value });
                  footerService.updateSetting('cta_phone', e.target.value);
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Call to Action Hours"
                value={settings.cta_hours || ''}
                onChange={(e) => {
                  setSettings({ ...settings, cta_hours: e.target.value });
                  footerService.updateSetting('cta_hours', e.target.value);
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Quick Links Tab */}
      {currentTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Quick Links</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenQuickLinkDialog()}>
              Add Quick Link
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quickLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>{link.label}</TableCell>
                    <TableCell>{link.url}</TableCell>
                    <TableCell>{link.order}</TableCell>
                    <TableCell>{link.is_active ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenQuickLinkDialog(link)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteQuickLink(link.id!)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Discover Links Tab */}
      {currentTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Discover Links</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDiscoverLinkDialog()}>
              Add Discover Link
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {discoverLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>{link.label}</TableCell>
                    <TableCell>{link.url}</TableCell>
                    <TableCell>{link.order}</TableCell>
                    <TableCell>{link.is_active ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDiscoverLinkDialog(link)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteDiscoverLink(link.id!)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Social Links Tab */}
      {currentTab === 3 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Social Links</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenSocialLinkDialog()}>
              Add Social Link
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Platform</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {socialLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>{link.platform}</TableCell>
                    <TableCell>{link.url}</TableCell>
                    <TableCell>{link.is_active ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenSocialLinkDialog(link)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteSocialLink(link.id!)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Quick Link Dialog */}
      <Dialog open={openQuickLinkDialog} onClose={() => setOpenQuickLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingQuickLink ? 'Edit Quick Link' : 'Add Quick Link'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Label"
            value={quickLinkFormData.label}
            onChange={(e) => setQuickLinkFormData({ ...quickLinkFormData, label: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="URL"
            value={quickLinkFormData.url}
            onChange={(e) => setQuickLinkFormData({ ...quickLinkFormData, url: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Order"
            type="number"
            value={quickLinkFormData.order}
            onChange={(e) => setQuickLinkFormData({ ...quickLinkFormData, order: parseInt(e.target.value) })}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={quickLinkFormData.is_active}
                onChange={(e) => setQuickLinkFormData({ ...quickLinkFormData, is_active: e.target.checked })}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQuickLinkDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveQuickLink} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Discover Link Dialog */}
      <Dialog open={openDiscoverLinkDialog} onClose={() => setOpenDiscoverLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDiscoverLink ? 'Edit Discover Link' : 'Add Discover Link'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Label"
            value={discoverLinkFormData.label}
            onChange={(e) => setDiscoverLinkFormData({ ...discoverLinkFormData, label: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="URL"
            value={discoverLinkFormData.url}
            onChange={(e) => setDiscoverLinkFormData({ ...discoverLinkFormData, url: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Order"
            type="number"
            value={discoverLinkFormData.order}
            onChange={(e) => setDiscoverLinkFormData({ ...discoverLinkFormData, order: parseInt(e.target.value) })}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={discoverLinkFormData.is_active}
                onChange={(e) => setDiscoverLinkFormData({ ...discoverLinkFormData, is_active: e.target.checked })}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDiscoverLinkDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveDiscoverLink} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Social Link Dialog */}
      <Dialog open={openSocialLinkDialog} onClose={() => setOpenSocialLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSocialLink ? 'Edit Social Link' : 'Add Social Link'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Platform</InputLabel>
            <Select
              value={socialLinkFormData.platform}
              onChange={(e) => setSocialLinkFormData({ ...socialLinkFormData, platform: e.target.value as any })}
            >
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="URL"
            value={socialLinkFormData.url}
            onChange={(e) => setSocialLinkFormData({ ...socialLinkFormData, url: e.target.value })}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={socialLinkFormData.is_active}
                onChange={(e) => setSocialLinkFormData({ ...socialLinkFormData, is_active: e.target.checked })}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSocialLinkDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveSocialLink} variant="contained">Save</Button>
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
              <input type="file" accept="image/*" onChange={handleLogoChange} style={{ marginBottom: 16 }} />
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

export default FooterManagement;

