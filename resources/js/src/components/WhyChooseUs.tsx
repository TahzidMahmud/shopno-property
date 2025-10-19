import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CameraAltIcon from '@mui/icons-material/CameraAlt'; // For "Trusted by Thousands"
import ChairIcon from '@mui/icons-material/Chair'; // For "Wide Range of Properties"
import DescriptionIcon from '@mui/icons-material/Description'; // For "Buy Homes"
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'; // For "100% Secure"
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // For video play button
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'; // For navigation
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // For navigation
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'; // For "Learn More" button

const features = [
  {
    id: 1,
    icon: <CameraAltIcon sx={{ fontSize: 30 }} />,
    title: 'Trusted by Thousands',
    description: 'Lorem Ipsum has been unknown printer took a galley of type and',
    active: true,
  },
  {
    id: 2,
    icon: <ChairIcon sx={{ fontSize: 30 }} />,
    title: 'Wide Range of Properties',
    description: 'Lorem Ipsum has been unknown printer took a galley of type and',
    active: false,
  },
  {
    id: 3,
    icon: <DescriptionIcon sx={{ fontSize: 30 }} />,
    title: 'Buy Homes',
    description: 'Lorem Ipsum has been unknown printer took a galley of type and',
    active: false,
  },
  {
    id: 4,
    icon: <AccessAlarmIcon sx={{ fontSize: 30 }} />,
    title: '100% Secure',
    description: 'Lorem Ipsum has been unknown printer took a galley of type and',
    active: false,
  },
];

export default function WhyChooseUs() {
  return (
    <Box sx={{ py: '4rem', px: { xs: 2, md: 8 }, maxWidth: 'lg', mx: 'auto' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#1f191fff', fontWeight: 'bold' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1f191fff', mr: 1 }} /> Our Approach <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1f191fff', ml: 1 }} />
            </Typography>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why Choose Us <Box component="span" sx={{ fontWeight: 'bold' }}>Shopno</Box>{' '}
              <Box component="span" sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                transform: 'rotate(-5deg)',
                display: 'inline-block',
                ml: 1,
              }}>Property</Box>
            </Typography>
          </Box>


          <Box>
            {features.map((feature) => (
              <Box
                key={feature.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  p: 2,
                  mb: 2,
                  borderRadius: '8px',
                  backgroundColor: feature.active ? 'primary.main' : 'white',
                  color: feature.active ? 'white' : 'text.primary',
                  boxShadow: feature.active ? 3 : 1,
                  transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{
                  mr: 2,
                  p: 1.5,
                  borderRadius: '8px', // Rounded square background for icons
                  backgroundColor: feature.active ? 'white' : 'grey.100', // White for active, light grey for inactive
                  color: feature.active ? 'primary.main' : 'text.secondary', // Icon color
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {React.cloneElement(feature.icon, { sx: { fontSize: 30, color: feature.active ? 'primary.main' : 'text.secondary' } })}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: feature.active ? 'white' : 'text.primary' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: feature.active ? 'white' : 'text.secondary' }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
        <Box sx={{ marginTop: '5rem' , marginBottom: '3rem'}}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Explore the premier UK property hub to discover a range of houses and flats for sale or rent.
          </Typography>
        </Box>
          <Box sx={{
            position: 'relative',
            height: 400,
            backgroundImage: 'url(https://via.placeholder.com/600x400?text=Why+Choose+Us+Image)', // Placeholder image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
            }
          }}>
            <PlayArrowIcon sx={{ fontSize: 80, color: 'white', zIndex: 1 }} />
          </Box>

        </Grid>
        <Grid item xs={12} md={12}>
             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
                <Button variant="outlined"  size="large" sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
                Learn More <ArrowOutwardIcon sx={{ ml: 1, fontSize: '1rem' }} />
                </Button>
            </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
