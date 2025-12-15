import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Card,
  CardMedia,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PropertyType, PropertyTypeFormData } from '../../services/propertyTypeService';

interface PropertyTypeFormProps {
  propertyType?: PropertyType;
  onSubmit: (data: PropertyTypeFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const initialFormData: PropertyTypeFormData = {
  name: '',
  type_value: '',
  icon_name: '',
  icon_image: null,
  order: 0,
  is_active: true,
};

const PropertyTypeForm: React.FC<PropertyTypeFormProps> = ({
  propertyType,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PropertyTypeFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [iconImagePreview, setIconImagePreview] = useState<string | null>(null);
  const [existingIconImage, setExistingIconImage] = useState<string | null>(null);

  useEffect(() => {
    if (propertyType) {
      setFormData({
        name: propertyType.name || '',
        type_value: propertyType.type_value || '',
        icon_name: propertyType.icon_name || '',
        icon_image: null,
        order: propertyType.order || 0,
        is_active: propertyType.is_active !== false,
      });
      if (propertyType.icon_image) {
        const iconUrl = propertyType.icon_image.startsWith('http') 
          ? propertyType.icon_image 
          : `/storage/${propertyType.icon_image}`;
        setExistingIconImage(iconUrl);
      }
    } else {
      setFormData(initialFormData);
      setExistingIconImage(null);
      setIconImagePreview(null);
    }
  }, [propertyType]);

  const handleInputChange = (field: keyof PropertyTypeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, icon_image: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconImagePreview(reader.result as string);
        setExistingIconImage(null);
      };
      reader.readAsDataURL(file);
    } else {
      setIconImagePreview(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Label is required';
    }
    if (!formData.type_value.trim()) {
      newErrors.type_value = 'Type value is required';
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
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {propertyType ? 'Edit Property Type' : 'Add New Property Type'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Label"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Type Value"
              value={formData.type_value}
              onChange={(e) => handleInputChange('type_value', e.target.value)}
              error={!!errors.type_value}
              helperText={errors.type_value || 'This value will be stored in the property.type field'}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Icon Name (Optional)"
              value={formData.icon_name}
              onChange={(e) => handleInputChange('icon_name', e.target.value)}
              helperText="Icon identifier (e.g., HouseIcon, ApartmentIcon)"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 56 }}
            >
              Upload Icon Image (Optional)
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </Button>
            {(iconImagePreview || existingIconImage) && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={iconImagePreview || existingIconImage || ''}
                    alt="Icon Preview"
                    sx={{ height: 100, objectFit: 'contain' }}
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
                      handleFileChange(null);
                      setExistingIconImage(null);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Card>
                {formData.icon_image && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {formData.icon_image.name}
                  </Typography>
                )}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Order"
              type="number"
              value={formData.order}
              onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                />
              }
              label="Active"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Saving...' : propertyType ? 'Update Property Type' : 'Create Property Type'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PropertyTypeForm;

