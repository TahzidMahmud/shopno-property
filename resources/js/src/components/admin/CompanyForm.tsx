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
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Company, CompanyFormData } from '../../services/companyService';

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const initialFormData: CompanyFormData = {
  name: '',
  logo: null,
  owner_name: '',
};

const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CompanyFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [existingLogo, setExistingLogo] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        logo: null,
        owner_name: company.owner_name || '',
      });
      if (company.logo) {
        const logoUrl = company.logo.startsWith('http') 
          ? company.logo 
          : `/storage/${company.logo}`;
        setExistingLogo(logoUrl);
      }
    } else {
      setFormData(initialFormData);
      setExistingLogo(null);
      setLogoPreview(null);
    }
  }, [company]);

  const handleInputChange = (field: keyof CompanyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, logo: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setExistingLogo(null);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    if (!formData.owner_name.trim()) {
      newErrors.owner_name = 'Owner name is required';
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
        {company ? 'Edit Company' : 'Add New Company'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
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
              label="Owner Name"
              value={formData.owner_name}
              onChange={(e) => handleInputChange('owner_name', e.target.value)}
              error={!!errors.owner_name}
              helperText={errors.owner_name}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 56 }}
            >
              Upload Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </Button>
            {(logoPreview || existingLogo) && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={logoPreview || existingLogo || ''}
                    alt="Logo Preview"
                    sx={{ height: 200, objectFit: 'contain' }}
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
                      setExistingLogo(null);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Card>
                {formData.logo && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {formData.logo.name}
                  </Typography>
                )}
              </Box>
            )}
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
                {loading ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CompanyForm;


