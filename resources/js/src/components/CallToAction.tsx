import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, CircularProgress } from '@mui/material';
import { homePageSettingService } from '../services/homePageService';

export default function CallToAction() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission to backend
    console.log('Form submitted:', formData);
    alert('Thank you for your interest! We will contact you soon.');
    setFormData({
      fullName: '',
      companyName: '',
      location: '',
      phoneNumber: '',
      email: '',
      projectDetails: '',
    });
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
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      minHeight: '100vh',
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
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Be A{' '}
              <Box component="span" sx={{ backgroundColor: 'info.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, transform: 'rotate(-6deg)', display: 'inline-block' }}>
                Partner?
              </Box>
            </Typography>
            <Typography variant="body1">
              We will confirm your appointment within 2 hours
            </Typography>
          </Box>
        </Box>

        {/* Right Section - Form */}
        <Box sx={{ width: { xs: '100%', md: '60%' }, p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Full Name*</Typography>
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
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Company name</Typography>
                <TextField 
                  fullWidth 
                  placeholder="Enter name" 
                  variant="standard"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Location*</Typography>
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
                  sx={{ backgroundColor: 'info.main', '&:hover': { backgroundColor: 'info.dark' } }} 
                  fullWidth
                >
                  Submit Request
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
