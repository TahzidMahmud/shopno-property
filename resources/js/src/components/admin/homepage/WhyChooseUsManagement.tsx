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
  Card,
  CardMedia,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { WhyChooseUsFeature, WhyChooseUsFeatureFormData } from '../../../types/HomePage';
import { whyChooseUsFeatureService } from '../../../services/homePageService';
import { getYouTubeEmbedUrl, extractYouTubeVideoId } from '../../../utils/youtube';

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
    video_url: '',
    video_thumbnail: null,
    is_active: false,
    order: 0,
  });
  const [videoThumbnailPreview, setVideoThumbnailPreview] = useState<string | null>(null);
  const [existingVideoThumbnail, setExistingVideoThumbnail] = useState<string | null>(null);
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

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const handleOpenDialog = (feature?: WhyChooseUsFeature) => {
    if (feature) {
      setEditingFeature(feature);
      setFormData({
        icon_name: feature.icon_name,
        title: feature.title,
        description: feature.description,
        video_url: feature.video_url || '',
        video_thumbnail: null,
        is_active: feature.is_active,
        order: feature.order,
      });
      setExistingVideoThumbnail(getImageUrl(feature.video_thumbnail) || null);
      setVideoThumbnailPreview(null);
    } else {
      setEditingFeature(null);
      setFormData({
        icon_name: 'CameraAlt',
        title: '',
        description: '',
        video_url: '',
        video_thumbnail: null,
        is_active: false,
        order: features.length,
      });
      setExistingVideoThumbnail(null);
      setVideoThumbnailPreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFeature(null);
    setExistingVideoThumbnail(null);
    if (videoThumbnailPreview) {
      URL.revokeObjectURL(videoThumbnailPreview);
      setVideoThumbnailPreview(null);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (videoThumbnailPreview) {
        URL.revokeObjectURL(videoThumbnailPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setVideoThumbnailPreview(previewUrl);
      setExistingVideoThumbnail(null);
      setFormData(prev => ({ ...prev, video_thumbnail: file }));
    } else {
      if (videoThumbnailPreview) {
        URL.revokeObjectURL(videoThumbnailPreview);
        setVideoThumbnailPreview(null);
      }
      setFormData(prev => ({ ...prev, video_thumbnail: null }));
    }
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
              label="YouTube Video URL"
              fullWidth
              value={formData.video_url}
              onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              helperText="Enter a YouTube video URL (watch, shorts, or youtu.be format)"
            />
            {formData.video_url && extractYouTubeVideoId(formData.video_url) && (
              <Box sx={{ mt: 1 }}>
                <Card>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '56.25%', // 16:9 aspect ratio
                      overflow: 'hidden',
                      borderRadius: 1,
                    }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        border: 0,
                      }}
                      src={getYouTubeEmbedUrl(formData.video_url) || ''}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                </Card>
              </Box>
            )}
            {formData.video_url && !extractYouTubeVideoId(formData.video_url) && (
              <Alert severity="warning">
                Please enter a valid YouTube URL
              </Alert>
            )}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 56 }}
            >
              Upload Video Thumbnail
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleThumbnailChange}
              />
            </Button>
            {(videoThumbnailPreview || existingVideoThumbnail) && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={videoThumbnailPreview || existingVideoThumbnail || ''}
                    alt="Video Thumbnail Preview"
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                    }}
                    onClick={() => {
                      handleThumbnailChange({ target: { files: null } } as any);
                      setExistingVideoThumbnail(null);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Card>
                {formData.video_thumbnail && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {formData.video_thumbnail.name}
                  </Typography>
                )}
              </Box>
            )}
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


