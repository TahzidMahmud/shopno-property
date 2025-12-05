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
} from '@mui/material';
import { Facility, FacilityFormData } from '../../types/Facility';

interface FacilityFormProps {
  facility?: Facility;
  onSubmit: (data: FacilityFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const initialFormData: FacilityFormData = {
  title: '',
  image: null,
};

const FacilityForm: React.FC<FacilityFormProps> = ({
  facility,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FacilityFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (facility) {
      setFormData({
        title: facility.title || '',
        image: null,
      });
      // Set existing image preview
      if (facility.image) {
        setImagePreview(`/storage/${facility.image}`);
      }
    }
  }, [facility]);

  const handleInputChange = (field: keyof FacilityFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image: file }));

    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
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
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {facility ? 'Edit Facility' : 'Add New Facility'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Title Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Facility Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
              placeholder="Enter facility name (e.g., Swimming Pool, Gym, Parking)"
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Facility Image
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 56, mb: 2 }}
            >
              {formData.image ? 'Change Image' : 'Upload Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </Button>

            {/* Image Preview */}
            {imagePreview && (
              <Card sx={{ maxWidth: 300, mx: 'auto' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview}
                  alt="Facility preview"
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            )}

            {formData.image && (
              <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                Selected: {formData.image.name}
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
                {loading ? 'Saving...' : facility ? 'Update Facility' : 'Create Facility'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default FacilityForm;
