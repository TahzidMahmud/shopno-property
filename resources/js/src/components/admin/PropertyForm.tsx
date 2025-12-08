import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
  ListItemText,
  CardMedia,
  IconButton,
  Card,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Property, PropertyFormData } from '../../types/Property';
import { Facility } from '../../types/Facility';
import { facilityService } from '../../services/facilityService';

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const initialFormData: PropertyFormData = {
  title: '',
  status: '',
  area: '',
  location: '',
  type: '',
  total_floor: '',
  total_flat: '',
  flat_size: '',
  total_parking: '',
  price_range: '',
  main_image: null,
  layout_images: [],
  gallery_images: [],
  demo_video: null,
  booking_form_background_image: null,
  full_address: '',
  latitude: '',
  longitude: '',
  key_transports: [],
  under_development: '',
  bedrooms: '',
  bathrooms: '',
  company_name: '',
  facilities: [],
};

const PropertyForm: React.FC<PropertyFormProps> = ({
  property,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transportName, setTransportName] = useState('');
  const [transportIcon, setTransportIcon] = useState('');
  const [transportDistance, setTransportDistance] = useState('');
  const [availableFacilities, setAvailableFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  
  // Preview URLs for new files
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [demoVideoPreview, setDemoVideoPreview] = useState<string | null>(null);
  const [bookingFormBgPreview, setBookingFormBgPreview] = useState<string | null>(null);
  const [layoutImagesPreviews, setLayoutImagesPreviews] = useState<string[]>([]);
  const [galleryImagesPreviews, setGalleryImagesPreviews] = useState<string[]>([]);
  
  // Existing images from property (when editing)
  const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
  const [existingDemoVideo, setExistingDemoVideo] = useState<string | null>(null);
  const [existingBookingFormBg, setExistingBookingFormBg] = useState<string | null>(null);
  const [existingLayoutImages, setExistingLayoutImages] = useState<string[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  
  // Helper function to get image URL
  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  useEffect(() => {
    // Load available facilities
    const loadFacilities = async () => {
      setLoadingFacilities(true);
      try {
        const facilities = await facilityService.getAll();
        setAvailableFacilities(facilities);
      } catch (error) {
        console.error('Error loading facilities:', error);
      } finally {
        setLoadingFacilities(false);
      }
    };
    loadFacilities();
  }, []);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        status: property.status || '',
        area: property.area || '',
        location: property.location || '',
        type: property.type || '',
        total_floor: property.total_floor || '',
        total_flat: property.total_flat || '',
        flat_size: property.flat_size || '',
        total_parking: property.total_parking || '',
        price_range: property.price_range || '',
        main_image: null,
        layout_images: [],
        gallery_images: [],
        demo_video: null,
        booking_form_background_image: null,
        full_address: property.full_address || '',
        latitude: property.latitude || '',
        longitude: property.longitude || '',
        key_transports: property.key_transports || [],
        under_development: property.under_development || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        company_name: property.company_name || '',
        facilities: property.facilities?.map(f => f.id!).filter((id): id is number => id !== undefined) || [],
      });
      
      // Set existing images for preview
      setExistingMainImage(getImageUrl(property.main_image) || null);
      setExistingDemoVideo(getImageUrl(property.demo_video) || null);
      setExistingBookingFormBg(getImageUrl(property.booking_form_background_image) || null);
      setExistingLayoutImages(
        property.layout_images?.map(img => getImageUrl(img)).filter((url): url is string => url !== null) || []
      );
      setExistingGalleryImages(
        property.gallery_images?.map(img => getImageUrl(img)).filter((url): url is string => url !== null) || []
      );
    } else {
      // Reset existing images when creating new property
      setExistingMainImage(null);
      setExistingDemoVideo(null);
      setExistingBookingFormBg(null);
      setExistingLayoutImages([]);
      setExistingGalleryImages([]);
    }
  }, [property]);

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: 'main_image' | 'demo_video' | 'booking_form_background_image', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    
      // Create preview URL for new file
      if (file) {
        // Revoke old preview URL if exists
        if (field === 'main_image' && mainImagePreview) {
          URL.revokeObjectURL(mainImagePreview);
        } else if (field === 'demo_video' && demoVideoPreview) {
          URL.revokeObjectURL(demoVideoPreview);
        } else if (field === 'booking_form_background_image' && bookingFormBgPreview) {
          URL.revokeObjectURL(bookingFormBgPreview);
        }
        
        const previewUrl = URL.createObjectURL(file);
        if (field === 'main_image') {
          setMainImagePreview(previewUrl);
          setExistingMainImage(null); // Clear existing when new file is selected
        } else if (field === 'demo_video') {
          setDemoVideoPreview(previewUrl);
          setExistingDemoVideo(null); // Clear existing when new file is selected
        } else if (field === 'booking_form_background_image') {
          setBookingFormBgPreview(previewUrl);
          setExistingBookingFormBg(null); // Clear existing when new file is selected
        }
      } else {
        if (field === 'main_image') {
          if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
          setMainImagePreview(null);
        } else if (field === 'demo_video') {
          if (demoVideoPreview) URL.revokeObjectURL(demoVideoPreview);
          setDemoVideoPreview(null);
        } else if (field === 'booking_form_background_image') {
          if (bookingFormBgPreview) URL.revokeObjectURL(bookingFormBgPreview);
          setBookingFormBgPreview(null);
        }
      }
  };

  const handleMultipleFileChange = (field: 'layout_images' | 'gallery_images', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({ ...prev, [field]: fileArray }));
      
      // Create preview URLs for new files
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      if (field === 'layout_images') {
        setLayoutImagesPreviews(prev => [...prev, ...previewUrls]);
      } else if (field === 'gallery_images') {
        setGalleryImagesPreviews(prev => [...prev, ...previewUrls]);
      }
    }
  };
  
  const removeLayoutImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      layout_images: prev.layout_images.filter((_, i) => i !== index)
    }));
    setLayoutImagesPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };
  
  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
    setGalleryImagesPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };
  
  const removeExistingLayoutImage = (index: number) => {
    setExistingLayoutImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingGalleryImage = (index: number) => {
    setExistingGalleryImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      if (demoVideoPreview) URL.revokeObjectURL(demoVideoPreview);
      if (bookingFormBgPreview) URL.revokeObjectURL(bookingFormBgPreview);
      layoutImagesPreviews.forEach(url => URL.revokeObjectURL(url));
      galleryImagesPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mainImagePreview, demoVideoPreview, bookingFormBgPreview, layoutImagesPreviews, galleryImagesPreviews]);

  const addTransport = () => {
    if (transportName.trim() && transportIcon.trim() && transportDistance.trim()) {
      const newTransport = {
        name: transportName.trim(),
        icon: transportIcon.trim(),
        distance: transportDistance.trim(),
      };
      setFormData(prev => ({
        ...prev,
        key_transports: [...prev.key_transports, newTransport]
      }));
      setTransportName('');
      setTransportIcon('');
      setTransportDistance('');
    }
  };

  const removeTransport = (index: number) => {
    setFormData(prev => ({
      ...prev,
      key_transports: prev.key_transports.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {property ? 'Edit Property' : 'Add New Property'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                <MenuItem value="rented">Rented</MenuItem>
                <MenuItem value="under_construction">Under Construction</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                label="Type"
              >
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
                <MenuItem value="land">Land</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Area"
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Address"
              value={formData.full_address}
              onChange={(e) => handleInputChange('full_address', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
            />
          </Grid>

          {/* Property Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Property Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Total Floors"
              type="number"
              value={formData.total_floor}
              onChange={(e) => handleInputChange('total_floor', e.target.value ? parseInt(e.target.value) : '')}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Total Flats"
              type="number"
              value={formData.total_flat}
              onChange={(e) => handleInputChange('total_flat', e.target.value ? parseInt(e.target.value) : '')}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value ? parseInt(e.target.value) : '')}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', e.target.value ? parseInt(e.target.value) : '')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Flat Size (sq ft)"
              type="number"
              value={formData.flat_size}
              onChange={(e) => handleInputChange('flat_size', e.target.value ? parseInt(e.target.value) : '')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Total Parking"
              type="number"
              value={formData.total_parking}
              onChange={(e) => handleInputChange('total_parking', e.target.value ? parseInt(e.target.value) : '')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price Range"
              value={formData.price_range}
              onChange={(e) => handleInputChange('price_range', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Under Development</InputLabel>
              <Select
                value={formData.under_development}
                onChange={(e) => handleInputChange('under_development', e.target.value)}
                label="Under Development"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Map & Location */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Map & Location
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              value={formData.latitude}
              onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : '')}
              inputProps={{ step: 'any' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              value={formData.longitude}
              onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : '')}
              inputProps={{ step: 'any' }}
            />
          </Grid>

          {/* Key Transports */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Key Transports
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Name (e.g., Supermarket)"
                value={transportName}
                onChange={(e) => setTransportName(e.target.value)}
                size="small"
                sx={{ flex: 1, minWidth: 150 }}
              />
              <TextField
                label="Icon (e.g., store, hospital, school)"
                value={transportIcon}
                onChange={(e) => setTransportIcon(e.target.value)}
                size="small"
                sx={{ flex: 1, minWidth: 150 }}
              />
              <TextField
                label="Distance (e.g., 300m)"
                value={transportDistance}
                onChange={(e) => setTransportDistance(e.target.value)}
                size="small"
                sx={{ flex: 1, minWidth: 120 }}
              />
              <Button onClick={addTransport} variant="outlined" sx={{ minWidth: 80 }}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.key_transports.map((transport, index) => (
                <Chip
                  key={index}
                  label={`${transport.name} (${transport.distance})`}
                  onDelete={() => removeTransport(index)}
                />
              ))}
            </Box>
          </Grid>

          {/* Facilities */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Facilities
            </Typography>
            {loadingFacilities ? (
              <CircularProgress size={24} />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Select Facilities</InputLabel>
                <Select
                  multiple
                  value={formData.facilities}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange('facilities', typeof value === 'string' ? value.split(',') : value);
                  }}
                  input={<OutlinedInput label="Select Facilities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((facilityId) => {
                        const facility = availableFacilities.find(f => f.id === facilityId);
                        return facility ? (
                          <Chip key={facilityId} label={facility.title} size="small" />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {availableFacilities.map((facility) => (
                    <MenuItem key={facility.id} value={facility.id}>
                      <Checkbox checked={formData.facilities.indexOf(facility.id!) > -1} />
                      <ListItemText primary={facility.title} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>

          {/* File Uploads */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Images & Media
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 56 }}
            >
              Upload Main Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange('main_image', e.target.files?.[0] || null)}
              />
            </Button>
            {(mainImagePreview || existingMainImage) && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={mainImagePreview || existingMainImage || ''}
                    alt="Main Image Preview"
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
                      handleFileChange('main_image', null);
                      setExistingMainImage(null);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Card>
                {formData.main_image && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {formData.main_image.name}
                  </Typography>
                )}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 56 }}
            >
              Upload Demo Video
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={(e) => handleFileChange('demo_video', e.target.files?.[0] || null)}
              />
            </Button>
            {(demoVideoPreview || existingDemoVideo) && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Card sx={{ position: 'relative' }}>
                  {demoVideoPreview ? (
                    <video
                      src={demoVideoPreview}
                      controls
                      style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                    />
                  ) : existingDemoVideo ? (
                    <video
                      src={existingDemoVideo}
                      controls
                      style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                    />
                  ) : null}
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
                      handleFileChange('demo_video', null);
                      setExistingDemoVideo(null);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Card>
                {formData.demo_video && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {formData.demo_video.name}
                  </Typography>
                )}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 56 }}
            >
              Upload Booking Form Background
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange('booking_form_background_image', e.target.files?.[0] || null)}
              />
            </Button>
            {(bookingFormBgPreview || existingBookingFormBg) && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={bookingFormBgPreview || existingBookingFormBg || ''}
                    alt="Booking Form Background Preview"
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
                      handleFileChange('booking_form_background_image', null);
                      setExistingBookingFormBg(null);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Card>
                {formData.booking_form_background_image && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {formData.booking_form_background_image.name}
                  </Typography>
                )}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 56 }}
            >
              Upload Layout Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleMultipleFileChange('layout_images', e.target.files)}
              />
            </Button>
            {(formData.layout_images.length > 0 || existingLayoutImages.length > 0) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  {formData.layout_images.length + existingLayoutImages.length} image(s) selected
                </Typography>
                <Grid container spacing={2}>
                  {/* Existing layout images */}
                  {existingLayoutImages.map((url, index) => (
                    <Grid item xs={6} sm={4} md={3} key={`existing-layout-${index}`}>
                      <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          image={url}
                          alt={`Layout ${index + 1}`}
                          sx={{ height: 120, objectFit: 'cover' }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            width: 24,
                            height: 24,
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                          }}
                          onClick={() => removeExistingLayoutImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                  {/* New layout images */}
                  {layoutImagesPreviews.map((url, index) => (
                    <Grid item xs={6} sm={4} md={3} key={`new-layout-${index}`}>
                      <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          image={url}
                          alt={`New Layout ${index + 1}`}
                          sx={{ height: 120, objectFit: 'cover' }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            width: 24,
                            height: 24,
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                          }}
                          onClick={() => removeLayoutImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 56 }}
            >
              Upload Gallery Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleMultipleFileChange('gallery_images', e.target.files)}
              />
            </Button>
            {(formData.gallery_images.length > 0 || existingGalleryImages.length > 0) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  {formData.gallery_images.length + existingGalleryImages.length} image(s) selected
                </Typography>
                <Grid container spacing={2}>
                  {/* Existing gallery images */}
                  {existingGalleryImages.map((url, index) => (
                    <Grid item xs={6} sm={4} md={3} key={`existing-gallery-${index}`}>
                      <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          image={url}
                          alt={`Gallery ${index + 1}`}
                          sx={{ height: 120, objectFit: 'cover' }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            width: 24,
                            height: 24,
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                          }}
                          onClick={() => removeExistingGalleryImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                  {/* New gallery images */}
                  {galleryImagesPreviews.map((url, index) => (
                    <Grid item xs={6} sm={4} md={3} key={`new-gallery-${index}`}>
                      <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          image={url}
                          alt={`New Gallery ${index + 1}`}
                          sx={{ height: 120, objectFit: 'cover' }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            width: 24,
                            height: 24,
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                          }}
                          onClick={() => removeGalleryImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PropertyForm;
