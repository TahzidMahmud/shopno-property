import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, CircularProgress } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ChairIcon from '@mui/icons-material/Chair';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { whyChooseUsFeatureService, homePageSettingService } from '../services/homePageService';
import { WhyChooseUsFeature } from '../types/HomePage';

// Icon mapping
const iconMap: Record<string, React.ReactElement> = {
  CameraAlt: <CameraAltIcon sx={{ fontSize: 30 }} />,
  Chair: <ChairIcon sx={{ fontSize: 30 }} />,
  Description: <DescriptionIcon sx={{ fontSize: 30 }} />,
  AccessAlarm: <AccessAlarmIcon sx={{ fontSize: 30 }} />,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || <CameraAltIcon sx={{ fontSize: 30 }} />;
};

export default function WhyChooseUs() {
  const [features, setFeatures] = useState<WhyChooseUsFeature[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featuresData, settings] = await Promise.all([
        whyChooseUsFeatureService.getAll(),
        homePageSettingService.getAll(),
      ]);
      
      const sortedFeatures = featuresData.sort((a, b) => a.order - b.order);
      setFeatures(sortedFeatures);
      
      // Set first active feature or first feature if none are active
      const firstActive = sortedFeatures.find(f => f.is_active);
      if (firstActive) {
        setActiveFeature(firstActive.id!);
      } else if (sortedFeatures.length > 0) {
        setActiveFeature(sortedFeatures[0].id!);
      }
      
      setVideoUrl(settings['why_choose_us_video'] || null);
    } catch (error) {
      console.error('Error loading Why Choose Us data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=Why+Choose+Us+Image';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  if (loading) {
    return (
      <Box sx={{ py: '4rem', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: '4rem', px: { xs: 2, md: 8 }, maxWidth: 'lg', mx: 'auto' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#1f191fff', fontWeight: 'bold' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1f191fff', mr: 1 }} /> Our Approach <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1f191fff', ml: 1 }} />
            </Typography>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Why Choose Us{' '}
              <Box component="span" sx={{
                backgroundColor: '#00bcd4',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: '4px',
                transform: 'rotate(-5deg)',
                display: 'inline-block',
                ml: 1,
                fontWeight: 'bold',
              }}>Shopno Property</Box>
            </Typography>
          </Box>

          <Box>
            {features.map((feature) => {
              const isActive = activeFeature === feature.id;
              return (
                <Box
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id!)}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    p: 2,
                    mb: 2,
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#00bcd4' : 'white',
                    color: isActive ? 'white' : '#212121',
                    boxShadow: isActive ? 3 : 1,
                    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{
                    mr: 2,
                    p: 1.5,
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'white' : '#f5f5f5',
                    color: isActive ? '#00bcd4' : '#757575',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 56,
                    minHeight: 56,
                  }}>
                    {React.cloneElement(getIcon(feature.icon_name), { 
                      sx: { fontSize: 30, color: isActive ? '#00bcd4' : '#757575' } 
                    })}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: isActive ? 'white' : 'text.primary' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isActive ? 'white' : 'text.secondary' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ marginTop: { xs: 2, md: '5rem' }, marginBottom: { xs: 2, md: '3rem' } }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, md: 4 }, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              Explore the premier UK property hub to discover a range of houses and flats for sale or rent.
            </Typography>
          </Box>
          <Box sx={{
            position: 'relative',
            height: { xs: 250, sm: 300, md: 400 },
            backgroundImage: videoUrl ? `url(${getImageUrl(videoUrl)})` : 'url(https://via.placeholder.com/600x400?text=Why+Choose+Us+Image)',
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
            <Box sx={{
              width: { xs: 60, md: 80 },
              height: { xs: 60, md: 80 },
              borderRadius: '50%',
              backgroundColor: '#9c27b0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#7b1fa2',
              }
            }}>
              <PlayArrowIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'white', ml: 0.5 }} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mt: { xs: 2, md: 4 }, gap: 2 }}>
            <Button 
              variant="outlined" 
              size="large" 
              sx={{ 
                borderColor: '#00bcd4', 
                color: '#00bcd4',
                textTransform: 'none',
                padding: { xs: '10px 20px', md: '12px 24px' },
                fontSize: { xs: '0.9rem', md: '1rem' },
                '&:hover': {
                  borderColor: '#00acc1',
                  backgroundColor: 'rgba(0, 188, 212, 0.04)',
                }
              }}
              endIcon={<ArrowOutwardIcon sx={{ fontSize: '1rem' }} />}
            >
              Learn More
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
