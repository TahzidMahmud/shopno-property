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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { HeroSlide, HeroSlideFormData } from '../../../types/HomePage';
import { heroSlideService } from '../../../services/homePageService';

const HeroSlidesManagement: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState<HeroSlideFormData>({
    background_image: null,
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_link: '',
    order: 0,
    is_active: true,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setLoading(true);
    try {
      const data = await heroSlideService.getAll();
      setSlides(data);
    } catch (error) {
      showNotification('Failed to load slides', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        background_image: null,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        button_text: slide.button_text,
        button_link: slide.button_link || '',
        order: slide.order,
        is_active: slide.is_active,
      });
      setPreview(slide.background_image ? `/storage/${slide.background_image}` : null);
    } else {
      setEditingSlide(null);
      setFormData({
        background_image: null,
        title: '',
        subtitle: '',
        description: '',
        button_text: '',
        button_link: '',
        order: slides.length,
        is_active: true,
      });
      setPreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSlide(null);
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, background_image: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingSlide) {
        await heroSlideService.update(editingSlide.id!, formData);
        showNotification('Slide updated successfully');
      } else {
        await heroSlideService.create(formData);
        showNotification('Slide created successfully');
      }
      handleCloseDialog();
      loadSlides();
    } catch (error) {
      showNotification('Failed to save slide', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        await heroSlideService.delete(id);
        showNotification('Slide deleted successfully');
        loadSlides();
      } catch (error) {
        showNotification('Failed to delete slide', 'error');
      }
    }
  };

  if (loading && slides.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Hero Slides Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Slide
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Subtitle</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slides.map((slide) => (
              <TableRow key={slide.id}>
                <TableCell>
                  <Box sx={{ width: 100, height: 60 }}>
                    <CardMedia
                      component="img"
                      image={slide.background_image ? `/storage/${slide.background_image}` : '/assets/house1.jpg'}
                      alt={slide.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{slide.title}</TableCell>
                <TableCell>{slide.subtitle}</TableCell>
                <TableCell>{slide.order}</TableCell>
                <TableCell>{slide.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(slide)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(slide.id!)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingSlide ? 'Edit Slide' : 'Add Slide'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              label="Subtitle"
              fullWidth
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
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
              label="Button Text"
              fullWidth
              value={formData.button_text}
              onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
            />
            <TextField
              label="Button Link"
              fullWidth
              value={formData.button_link}
              onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
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
            <Button variant="outlined" component="label">
              Upload Background Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
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

export default HeroSlidesManagement;


