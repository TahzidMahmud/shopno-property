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
} from '@mui/material';
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
  full_address: '',
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
  const [transportInput, setTransportInput] = useState('');
  const [availableFacilities, setAvailableFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

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
        full_address: property.full_address || '',
        key_transports: property.key_transports || [],
        under_development: property.under_development || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        company_name: property.company_name || '',
        facilities: property.facilities?.map(f => f.id!).filter((id): id is number => id !== undefined) || [],
      });
    }
  }, [property]);

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: 'main_image' | 'demo_video', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleMultipleFileChange = (field: 'layout_images' | 'gallery_images', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({ ...prev, [field]: fileArray }));
    }
  };

  const addTransport = () => {
    if (transportInput.trim() && !formData.key_transports.includes(transportInput.trim())) {
      setFormData(prev => ({
        ...prev,
        key_transports: [...prev.key_transports, transportInput.trim()]
      }));
      setTransportInput('');
    }
  };

  const removeTransport = (transport: string) => {
    setFormData(prev => ({
      ...prev,
      key_transports: prev.key_transports.filter(t => t !== transport)
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

          {/* Key Transports */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Key Transports
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Add Transport"
                value={transportInput}
                onChange={(e) => setTransportInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTransport())}
                size="small"
              />
              <Button onClick={addTransport} variant="outlined">
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.key_transports.map((transport) => (
                <Chip
                  key={transport}
                  label={transport}
                  onDelete={() => removeTransport(transport)}
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
            {formData.main_image && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected: {formData.main_image.name}
              </Typography>
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
            {formData.demo_video && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected: {formData.demo_video.name}
              </Typography>
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
            {formData.layout_images.length > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected: {formData.layout_images.length} files
              </Typography>
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
            {formData.gallery_images.length > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected: {formData.gallery_images.length} files
              </Typography>
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
