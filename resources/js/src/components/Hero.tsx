import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { heroSlideService } from '../services/homePageService';
import { HeroSlide } from '../types/HomePage';

const Hero: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const data = await heroSlideService.getAll();
      const activeSlides = data.filter(slide => slide.is_active).sort((a, b) => a.order - b.order);
      setSlides(activeSlides);
      if (activeSlides.length > 0) {
        setCurrentSlide(0);
      }
    } catch (error) {
      console.error('Error loading hero slides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const getImageUrl = (path: string) => {
    if (!path) return '/assets/house1.jpg';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  if (loading) {
    return (
      <Box sx={{ height: { xs: '500px', sm: '600px', md: '700px' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const activeSlide = slides[currentSlide];

  return (
    <Box sx={{
      position: 'relative',
      height: { xs: '500px', sm: '600px', md: '700px' },
      backgroundImage: `url(${getImageUrl(activeSlide.background_image)})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: { xs: 'center', md: 'flex-start' },
      textAlign: { xs: 'center', md: 'left' },
      paddingLeft: { xs: 2, md: '10%' },
      paddingRight: { xs: 2, md: 0 },
      transition: 'background-image 1s ease-in-out',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { xs: '100%', md: '800px' }, px: { xs: 2, md: 0 } }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ 
          color: '#ffffff', 
          fontSize: { xs: '2rem', sm: '3rem', md: '4.5rem' }, 
          lineHeight: 1.2,
          fontWeight: 'bold',
          mb: { xs: 1.5, md: 2 }
        }}>
          {activeSlide.title}
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#ffffff', 
          maxWidth: { xs: '100%', md: '600px' }, 
          mb: { xs: 3, md: 4 },
          fontSize: { xs: '0.9rem', md: '1.1rem' },
          lineHeight: 1.6
        }}>
          {activeSlide.description}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            padding: { xs: '12px 24px', md: '14px 32px' }, 
            fontSize: { xs: '0.9rem', md: '1rem' },
            backgroundColor: '#00bcd4',
            color: 'white',
            textTransform: 'none',
            borderRadius: '4px',
            width: { xs: '100%', sm: 'auto' },
            '&:hover': {
              backgroundColor: '#00acc1',
            }
          }}
          href={activeSlide.button_link || '#'}
          endIcon={<ArrowForwardIcon />}
        >
          {activeSlide.button_text}
        </Button>
      </Box>

      {/* Carousel Indicators */}
      {slides.length > 1 && (
        <Box sx={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          display: 'flex',
          gap: '8px',
        }}>
          {slides.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'white',
                opacity: currentSlide === index ? 1 : 0.5,
                cursor: 'pointer',
                transition: 'opacity 0.3s ease-in-out',
              }}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Hero;
