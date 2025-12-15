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
import { companyService, Company } from '../../services/companyService';
import { getYouTubeEmbedUrl, extractYouTubeVideoId } from '../../utils/youtube';

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const initialFormData: PropertyFormData = {
  title: '',
  description: '',
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
        featured_images: [],
        demo_video: '',
        demo_video_thumbnail: null,
        brochure: null,
        payment_schedule: null,
        booking_form_background_image: null,
        booking_form_image: null,
  full_address: '',
  latitude: '',
  longitude: '',
  key_transports: [],
  under_development: '',
  bedrooms: '',
  bathrooms: '',
  company_id: '',
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
  const [companies, setCompanies] = useState<Company[]>([]);

  // Preview URLs for new files
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [demoVideoThumbnailPreview, setDemoVideoThumbnailPreview] = useState<string | null>(null);
  const [bookingFormBgPreview, setBookingFormBgPreview] = useState<string | null>(null);
  const [bookingFormImagePreview, setBookingFormImagePreview] = useState<string | null>(null);
  const [layoutImagesPreviews, setLayoutImagesPreviews] = useState<string[]>([]);
  const [galleryImagesPreviews, setGalleryImagesPreviews] = useState<string[]>([]);
  const [featuredImagesPreviews, setFeaturedImagesPreviews] = useState<string[]>([]);

  // Existing images from property (when editing) - store both URLs for preview and paths for backend
  const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
  const [existingDemoVideoThumbnail, setExistingDemoVideoThumbnail] = useState<string | null>(null);
  const [existingBookingFormBg, setExistingBookingFormBg] = useState<string | null>(null);
  const [existingBookingFormImage, setExistingBookingFormImage] = useState<string | null>(null);
  const [existingLayoutImages, setExistingLayoutImages] = useState<string[]>([]); // URLs for preview
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]); // URLs for preview
  const [existingFeaturedImages, setExistingFeaturedImages] = useState<string[]>([]); // URLs for preview
  const [existingLayoutImagePaths, setExistingLayoutImagePaths] = useState<string[]>([]); // Original paths
  const [existingGalleryImagePaths, setExistingGalleryImagePaths] = useState<string[]>([]); // Original paths
  const [existingFeaturedImagePaths, setExistingFeaturedImagePaths] = useState<string[]>([]); // Original paths
  const [existingBrochure, setExistingBrochure] = useState<string | null>(null);
  const [existingPaymentSchedule, setExistingPaymentSchedule] = useState<string | null>(null);

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
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
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
        featured_images: [],
        demo_video: property.demo_video || '',
        demo_video_thumbnail: null,
        brochure: null,
        payment_schedule: null,
        booking_form_background_image: null,
        booking_form_image: null,
        full_address: property.full_address || '',
        latitude: property.latitude || '',
        longitude: property.longitude || '',
        key_transports: property.key_transports || [],
        under_development: property.under_development || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        company_id: property.company_id || '',
        facilities: property.facilities?.map(f => f.id!).filter((id): id is number => id !== undefined) || [],
      });

      // Set existing images for preview and store original paths
      setExistingMainImage(getImageUrl(property.main_image) || null);
      setExistingDemoVideoThumbnail(getImageUrl(property.demo_video_thumbnail) || null);
      setExistingBookingFormBg(getImageUrl(property.booking_form_background_image) || null);
      setExistingBookingFormImage(getImageUrl(property.booking_form_image) || null);
      setExistingBrochure(getImageUrl(property.brochure) || null);
      setExistingPaymentSchedule(getImageUrl(property.payment_schedule) || null);

      const layoutUrls = property.layout_images?.map(img => getImageUrl(img)).filter((url): url is string => url !== null) || [];
      const layoutPaths = property.layout_images?.filter((path): path is string => path !== null && path !== undefined) || [];
      setExistingLayoutImages(layoutUrls);
      setExistingLayoutImagePaths(layoutPaths);

      const galleryUrls = property.gallery_images?.map(img => getImageUrl(img)).filter((url): url is string => url !== null) || [];
      const galleryPaths = property.gallery_images?.filter((path): path is string => path !== null && path !== undefined) || [];
      setExistingGalleryImages(galleryUrls);
      setExistingGalleryImagePaths(galleryPaths);
    } else {
      // Reset existing images when creating new property
      setExistingMainImage(null);
      setExistingDemoVideoThumbnail(null);
      setExistingBookingFormBg(null);
      setExistingBookingFormImage(null);
      setExistingLayoutImages([]);
      setExistingGalleryImages([]);
      setExistingFeaturedImages([]);
      setExistingLayoutImagePaths([]);
      setExistingGalleryImagePaths([]);
      setExistingFeaturedImagePaths([]);
      setExistingBrochure(null);
      setExistingPaymentSchedule(null);
    }
  }, [property]);

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: 'main_image' | 'demo_video_thumbnail' | 'booking_form_background_image' | 'booking_form_image' | 'brochure' | 'payment_schedule', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));

      // Create preview URL for new file
      if (file) {
        // Revoke old preview URL if exists
        if (field === 'main_image' && mainImagePreview) {
          URL.revokeObjectURL(mainImagePreview);
        } else if (field === 'demo_video_thumbnail' && demoVideoThumbnailPreview) {
          URL.revokeObjectURL(demoVideoThumbnailPreview);
        } else if (field === 'booking_form_background_image' && bookingFormBgPreview) {
          URL.revokeObjectURL(bookingFormBgPreview);
        } else if (field === 'booking_form_image' && bookingFormImagePreview) {
          URL.revokeObjectURL(bookingFormImagePreview);
        }

        const previewUrl = URL.createObjectURL(file);
        if (field === 'main_image') {
          setMainImagePreview(previewUrl);
          setExistingMainImage(null); // Clear existing when new file is selected
        } else if (field === 'demo_video_thumbnail') {
          setDemoVideoThumbnailPreview(previewUrl);
          setExistingDemoVideoThumbnail(null); // Clear existing when new file is selected
        } else if (field === 'booking_form_background_image') {
          setBookingFormBgPreview(previewUrl);
          setExistingBookingFormBg(null); // Clear existing when new file is selected
        } else if (field === 'booking_form_image') {
          setBookingFormImagePreview(previewUrl);
          setExistingBookingFormImage(null); // Clear existing when new file is selected
        }
      } else {
        if (field === 'main_image') {
          if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
          setMainImagePreview(null);
        } else if (field === 'demo_video_thumbnail') {
          if (demoVideoThumbnailPreview) URL.revokeObjectURL(demoVideoThumbnailPreview);
          setDemoVideoThumbnailPreview(null);
        } else if (field === 'booking_form_background_image') {
          if (bookingFormBgPreview) URL.revokeObjectURL(bookingFormBgPreview);
          setBookingFormBgPreview(null);
        } else if (field === 'booking_form_image') {
          if (bookingFormImagePreview) URL.revokeObjectURL(bookingFormImagePreview);
          setBookingFormImagePreview(null);
          setExistingBookingFormImage(null);
        } else if (field === 'brochure') {
          setExistingBrochure(null);
        } else if (field === 'payment_schedule') {
          setExistingPaymentSchedule(null);
        }
      }
  };

  const handleMultipleFileChange = (field: 'layout_images' | 'gallery_images' | 'featured_images', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({ ...prev, [field]: fileArray }));

      // Create preview URLs for new files
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      if (field === 'layout_images') {
        setLayoutImagesPreviews(prev => [...prev, ...previewUrls]);
      } else if (field === 'gallery_images') {
        setGalleryImagesPreviews(prev => [...prev, ...previewUrls]);
      } else if (field === 'featured_images') {
        setFeaturedImagesPreviews(prev => [...prev, ...previewUrls]);
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

  const removeFeaturedImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      featured_images: prev.featured_images.filter((_, i) => i !== index)
    }));
    setFeaturedImagesPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const removeExistingLayoutImage = (index: number) => {
    setExistingLayoutImages(prev => prev.filter((_, i) => i !== index));
    setExistingLayoutImagePaths(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGalleryImages(prev => prev.filter((_, i) => i !== index));
    setExistingGalleryImagePaths(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFeaturedImage = (index: number) => {
    setExistingFeaturedImages(prev => prev.filter((_, i) => i !== index));
    setExistingFeaturedImagePaths(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      if (demoVideoThumbnailPreview) URL.revokeObjectURL(demoVideoThumbnailPreview);
      if (bookingFormBgPreview) URL.revokeObjectURL(bookingFormBgPreview);
      if (bookingFormImagePreview) URL.revokeObjectURL(bookingFormImagePreview);
      layoutImagesPreviews.forEach(url => URL.revokeObjectURL(url));
      galleryImagesPreviews.forEach(url => URL.revokeObjectURL(url));
      featuredImagesPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mainImagePreview, demoVideoThumbnailPreview, bookingFormBgPreview, bookingFormImagePreview, layoutImagesPreviews, galleryImagesPreviews, featuredImagesPreviews]);

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
      // Include existing image paths that should be kept (only when updating)
      const submitData = {
        ...formData,
        ...(property && {
          existing_layout_images: existingLayoutImagePaths,
          existing_gallery_images: existingGalleryImagePaths,
          existing_featured_images: existingFeaturedImagePaths,
        }),
      };
      await onSubmit(submitData);
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              placeholder="Enter property description..."
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
            <FormControl fullWidth>
              <InputLabel>Company</InputLabel>
              <Select
                value={formData.company_id}
                onChange={(e) => handleInputChange('company_id', e.target.value)}
                label="Company"
              >
                <MenuItem value="">None</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <TextField
              label="YouTube Video URL"
              fullWidth
              value={formData.demo_video}
              onChange={(e) => handleInputChange('demo_video', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              error={!!errors.demo_video}
              helperText={errors.demo_video || 'Enter a YouTube video URL (watch, shorts, or youtu.be format)'}
            />
            {formData.demo_video && extractYouTubeVideoId(formData.demo_video) && (
              <Box sx={{ mt: 2 }}>
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
                      src={getYouTubeEmbedUrl(formData.demo_video) || ''}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleInputChange('demo_video', '')}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Box>
            )}
            {formData.demo_video && !extractYouTubeVideoId(formData.demo_video) && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Please enter a valid YouTube URL
              </Alert>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
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
                onChange={(e) => handleFileChange('demo_video_thumbnail', e.target.files?.[0] || null)}
              />
            </Button>
            {(demoVideoThumbnailPreview || existingDemoVideoThumbnail) && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={demoVideoThumbnailPreview || existingDemoVideoThumbnail || ''}
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
                      handleFileChange('demo_video_thumbnail', null);
                      setExistingDemoVideoThumbnail(null);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Card>
                {formData.demo_video_thumbnail && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {formData.demo_video_thumbnail.name}
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
              Upload Brochure (PDF)
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={(e) => handleFileChange('brochure', e.target.files?.[0] || null)}
              />
            </Button>
            {(formData.brochure || existingBrochure) && (
              <Box sx={{ mt: 2 }}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      {formData.brochure ? (
                        <Typography variant="body2">
                          Selected: {formData.brochure.name}
                        </Typography>
                      ) : existingBrochure ? (
                        <Typography variant="body2">
                          Current: <a href={existingBrochure} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>View Brochure</a>
                        </Typography>
                      ) : null}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleFileChange('brochure', null);
                        setExistingBrochure(null);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Paper>
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
              Upload Payment Schedule (PDF)
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={(e) => handleFileChange('payment_schedule', e.target.files?.[0] || null)}
              />
            </Button>
            {(formData.payment_schedule || existingPaymentSchedule) && (
              <Box sx={{ mt: 2 }}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      {formData.payment_schedule ? (
                        <Typography variant="body2">
                          Selected: {formData.payment_schedule.name}
                        </Typography>
                      ) : existingPaymentSchedule ? (
                        <Typography variant="body2">
                          Current: <a href={existingPaymentSchedule} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>View Payment Schedule</a>
                        </Typography>
                      ) : null}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleFileChange('payment_schedule', null);
                        setExistingPaymentSchedule(null);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Paper>
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
              Upload Booking Form Image (Left Column)
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange('booking_form_image', e.target.files?.[0] || null)}
              />
            </Button>
            {(bookingFormImagePreview || existingBookingFormImage) && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={bookingFormImagePreview || existingBookingFormImage || ''}
                    alt="Booking Form Image Preview"
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
                      handleFileChange('booking_form_image', null);
                      setExistingBookingFormImage(null);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Card>
                {formData.booking_form_image && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {formData.booking_form_image.name}
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

          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 56 }}
            >
              Upload Featured Images (Slider)
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleMultipleFileChange('featured_images', e.target.files)}
              />
            </Button>
            {(formData.featured_images.length > 0 || existingFeaturedImages.length > 0) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  {formData.featured_images.length + existingFeaturedImages.length} image(s) selected
                </Typography>
                <Grid container spacing={2}>
                  {/* Existing featured images */}
                  {existingFeaturedImages.map((url, index) => (
                    <Grid item xs={6} sm={4} md={3} key={`existing-featured-${index}`}>
                      <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          image={url}
                          alt={`Featured ${index + 1}`}
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
                          onClick={() => removeExistingFeaturedImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                  {/* New featured images */}
                  {featuredImagesPreviews.map((url, index) => (
                    <Grid item xs={6} sm={4} md={3} key={`new-featured-${index}`}>
                      <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          image={url}
                          alt={`New Featured ${index + 1}`}
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
                          onClick={() => removeFeaturedImage(index)}
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
