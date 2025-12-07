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
                    backgroundColor: isActive ? 'primary.main' : 'white',
                    color: isActive ? 'white' : 'text.primary',
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
                    backgroundColor: isActive ? 'white' : 'grey.100',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {React.cloneElement(getIcon(feature.icon_name), { 
                      sx: { fontSize: 30, color: isActive ? 'primary.main' : 'text.secondary' } 
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
          <Box sx={{ marginTop: '5rem', marginBottom: '3rem' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Explore the premier UK property hub to discover a range of houses and flats for sale or rent.
            </Typography>
          </Box>
          <Box sx={{
            position: 'relative',
            height: 400,
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
            <PlayArrowIcon sx={{ fontSize: 80, color: 'white', zIndex: 1 }} />
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
            <Button variant="outlined" size="large" sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
              Learn More <ArrowOutwardIcon sx={{ ml: 1, fontSize: '1rem' }} />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
