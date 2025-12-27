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
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { PropertyListingFormData } from '../services/propertyListingService';
import { propertyTypeService, PropertyType } from '../services/propertyTypeService';

interface PropertyListingFormProps {
  onSubmit: (data: PropertyListingFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const propertyStatusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'under_construction', label: 'Under Construction' },
];

const PropertyListingForm: React.FC<PropertyListingFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PropertyListingFormData>({
    property_name: '',
    property_type: '',
    property_status: '',
    location: '',
    size: '',
    images: [],
    brochure: null,
    handover_date: '',
    price: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [brochurePreview, setBrochurePreview] = useState<string | null>(null);

  useEffect(() => {
    loadPropertyTypes();
  }, []);

  const loadPropertyTypes = async () => {
    try {
      const types = await propertyTypeService.getActive();
      setPropertyTypes(types);
    } catch (error) {
      console.error('Error loading property types:', error);
    }
  };

  const handleChange = (field: keyof PropertyListingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...(formData.images || []), ...files];
      handleChange('images', newImages);

      // Create previews
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    handleChange('images', newImages);
    setImagePreviews(newPreviews);
  };

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange('brochure', file);
    if (file) {
      setBrochurePreview(file.name);
    } else {
      setBrochurePreview(null);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.property_name.trim()) {
      newErrors.property_name = 'Property name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.images && formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        List Your Property
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Property Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Property Name"
              value={formData.property_name}
              onChange={(e) => handleChange('property_name', e.target.value)}
              error={!!errors.property_name}
              helperText={errors.property_name}
              required
            />
          </Grid>

          {/* Property Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Property Type</InputLabel>
              <Select
                value={formData.property_type || ''}
                onChange={(e) => handleChange('property_type', e.target.value)}
                label="Property Type"
              >
                <MenuItem value="">Select Property Type</MenuItem>
                {propertyTypes.map((type) => (
                  <MenuItem key={type.id} value={type.type_value}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Property Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Property Status</InputLabel>
              <Select
                value={formData.property_status || ''}
                onChange={(e) => handleChange('property_status', e.target.value)}
                label="Property Status"
              >
                <MenuItem value="">Select Status</MenuItem>
                {propertyStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
              required
            />
          </Grid>

          {/* Size */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Size"
              value={formData.size}
              onChange={(e) => handleChange('size', e.target.value)}
              placeholder="e.g., 1200 sq ft"
            />
          </Grid>

          {/* Price */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', e.target.value ? parseFloat(e.target.value) : undefined)}
              InputProps={{
                startAdornment: <InputAdornment position="start">৳</InputAdornment>,
              }}
            />
          </Grid>

          {/* Handover Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Handover Date"
              type="date"
              value={formData.handover_date}
              onChange={(e) => handleChange('handover_date', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Property Images (Multiple) *
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="images-upload"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="images-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Images
              </Button>
            </label>
            {errors.images && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.images}
              </Alert>
            )}
            {imagePreviews.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {imagePreviews.map((preview, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={preview}
                          alt={`Preview ${index + 1}`}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          {/* Brochure */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Property Brochure (Optional)
            </Typography>
            <input
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              id="brochure-upload"
              type="file"
              onChange={handleBrochureChange}
            />
            <label htmlFor="brochure-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 1 }}
              >
                Upload Brochure
              </Button>
            </label>
            {brochurePreview && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {brochurePreview}
              </Typography>
            )}
          </Grid>

          {/* Submit Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              {onCancel && (
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Submitting...' : 'Submit Listing'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PropertyListingForm;

