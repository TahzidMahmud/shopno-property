import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HouseIcon from '@mui/icons-material/House'; // Using for Modern Villa
import StoreIcon from '@mui/icons-material/Store'; // Using for Commercial
import LandscapeIcon from '@mui/icons-material/Landscape'; // Using for Land Share
import HotelIcon from '@mui/icons-material/Hotel'; // Using for Resort and Hotel
import BusinessIcon from '@mui/icons-material/Business'; // Alternative for Commercial if needed
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'; // Good for Resort

export default function ExploreByProperty() {
  const propertyTypes = [
    { id: 1, name: 'Resort', icon: <HolidayVillageIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: '2 Properties' },
    { id: 2, name: 'Modern Villa', icon: <HouseIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: '10 Properties' },
    { id: 3, name: 'Apartment', icon: <ApartmentIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: '3 Properties' },
    { id: 4, name: 'Commercial', icon: <StoreIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: '3 Properties' },
    { id: 5, name: 'Land Share', icon: <LandscapeIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: '5 Properties' },
    { id: 6, name: 'Hotel', icon: <HotelIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: '2 Properties' },
  ];

  return (
    <Box sx={{ py: 12, px: { xs: 2, md: 4, lg: 8 }, backgroundColor: '#4A148C', color: 'white' }}> {/* Dark purple background */}
      <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: 8, height: 8, backgroundColor: 'purple.300', transform: 'rotate(45deg)', mr: 0.5 }} />
          <Typography variant="body2" sx={{ color: 'purple.300', fontWeight: 'semibold' }}>
            Property Type
          </Typography>
          <Box sx={{ width: 8, height: 8, backgroundColor: 'purple.300', transform: 'rotate(45deg)', ml: 0.5 }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'white' }}>
            Explore By{' '}
            <Box component="span" sx={{ backgroundColor: 'info.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, transform: 'rotate(-6deg)', display: 'inline-block' }}>
              Property Type
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.300', maxWidth: '300px', textAlign: 'right' }}>
            Explore homes, apartments, and villas tailored to you
          </Typography>
        </Box>

        {/* Property Types Grid */}
        <Grid container spacing={4} justifyContent="center">
          {propertyTypes.map(type => (
            <Grid item xs={12} sm={6} md={2} key={type.id}>
              <Paper sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2, // Rounded corners
                boxShadow: 3, // Subtle shadow
                backgroundColor: 'white',
                color: 'text.primary',
                height: 180, // Fixed height for consistency
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}>
                {type.icon}
                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>{type.name}</Typography>
                <Typography variant="body2" color="text.secondary">{type.count}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
