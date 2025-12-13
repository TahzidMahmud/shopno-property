import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, CircularProgress, Alert } from '@mui/material';
import { homePageSettingService } from '../services/homePageService';
import { partnerSubmissionService } from '../services/partnerSubmissionService';

export default function CallToAction() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    location: '',
    phoneNumber: '',
    email: '',
    projectDetails: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await homePageSettingService.getAll();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string | undefined, fallback: string) => {
    if (!path) return fallback;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await partnerSubmissionService.submit({
        full_name: formData.fullName,
        company_name: formData.companyName || undefined,
        location: formData.location,
        phone_number: formData.phoneNumber,
        email: formData.email || undefined,
        project_details: formData.projectDetails,
      });

      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        companyName: '',
        location: '',
        phoneNumber: '',
        email: '',
        projectDetails: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || 
        'Failed to submit your request. Please try again later.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', minHeight: '100vh', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const backgroundImage = getImageUrl(settings['call_to_action_background'], '/assets/background-sky.jpg');
  const leftImage = getImageUrl(settings['call_to_action_image'], '/assets/house1.jpg');

  return (
    <Box sx={{
      position: 'relative',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      minHeight: '100vh',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backdropFilter: 'blur(2px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        zIndex: 0,
      }
    }}>
      <Box sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        width: '90%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Left Section - Image and Text */}
        <Box sx={{
          width: { xs: '100%', md: '40%' },
          backgroundImage: `url(${leftImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: 4,
          color: 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' } }}>
              Be A{' '}
              <Box component="span" sx={{ backgroundColor: '#00bcd4', color: 'white', px: { xs: 1, md: 1.5 }, py: { xs: 0.3, md: 0.5 }, borderRadius: '4px', transform: 'rotate(-5deg)', display: 'inline-block' }}>
                Partner?
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
              We will confirm your appointment within 2 hours
            </Typography>
          </Box>
        </Box>

        {/* Right Section - Form */}
        <Box sx={{ width: { xs: '100%', md: '60%' }, p: { xs: 2, md: 4 } }}>
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Thank you for your interest! We will contact you soon.
            </Alert>
          )}
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>Full Name*</Typography>
                <TextField 
                  fullWidth 
                  placeholder="Enter Your Name" 
                  variant="standard" 
                  required 
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>Company name</Typography>
                <TextField 
                  fullWidth 
                  placeholder="Enter name" 
                  variant="standard"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>Location*</Typography>
                <TextField 
                  fullWidth 
                  placeholder="Enter Your Address" 
                  variant="standard" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Phone Number*</Typography>
                <TextField 
                  fullWidth 
                  placeholder="Select Your Number" 
                  variant="standard" 
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Email</Typography>
                <TextField 
                  fullWidth 
                  placeholder="Select Your Email" 
                  variant="standard"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Project details*</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Tell us more about your idea"
                  variant="standard"
                  required
                  value={formData.projectDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectDetails: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit"
                  variant="contained" 
                  disabled={submitting}
                  sx={{ 
                    backgroundColor: '#00bcd4', 
                    textTransform: 'none',
                    padding: '14px 32px',
                    fontSize: '1rem',
                    '&:hover': { 
                      backgroundColor: '#00acc1' 
                    },
                    '&:disabled': {
                      backgroundColor: '#b0bec5'
                    }
                  }} 
                  fullWidth
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
