import React from 'react';
import { Box, Typography, TextField, Button, Grid, MenuItem } from '@mui/material';

export default function CallToAction() {
  return (
    <Box sx={{
      backgroundImage: 'url(/assets/background-sky.jpg)', // Placeholder for the overall background
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8, // Vertical padding
      minHeight: '100vh', // Ensure it takes full viewport height for centering
    }}>
      <Box sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        width: '90%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on small screens, side-by-side on medium and up
        overflow: 'hidden', // Ensures rounded corners apply to children
      }}>
        {/* Left Section - Image and Text */}
        <Box sx={{
          width: { xs: '100%', md: '40%' },
          backgroundImage: 'url(/assets/house1.jpg)', // Placeholder for the house image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start', // Align text to the left
          p: 4,
          color: 'white',
          position: 'relative',
          '&::before': { // Overlay for better text readability
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Full Name*</Typography>
              <TextField fullWidth placeholder="Enter Your Name" variant="standard" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Company name</Typography>
              <TextField fullWidth placeholder="Enter name" variant="standard" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Location*</Typography>
              <TextField fullWidth placeholder="Enter Your Address" variant="standard" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Phone Number*</Typography>
              <TextField fullWidth placeholder="Select Your Number" variant="standard" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Email</Typography>
              <TextField fullWidth placeholder="Select Your Email" variant="standard" />
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
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" sx={{ backgroundColor: 'info.main', '&:hover': { backgroundColor: 'info.dark' } }} fullWidth>
                Submit Request
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
