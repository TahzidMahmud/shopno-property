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
      height: { xs: '280px', sm: '600px', md: '700px' },
      backgroundImage: `url(${getImageUrl(activeSlide.background_image)})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: { xs: 'flex-start', md: 'flex-start' },
      textAlign: { xs: 'left', md: 'left' },
      paddingLeft: { xs: '16px', md: '10%' },
      paddingRight: { xs: '16px', md: 0 },
      paddingTop: { xs: '56px', md: 0 },
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
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { xs: '219px', md: '800px' }, px: { xs: 0, md: 0 } }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{
          color: '#ffffff',
          fontSize: { xs: '12px', sm: '3rem', md: '4.5rem' },
          lineHeight: 1.2,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          mb: { xs: '6px', md: 2 }
        }}>
          {activeSlide.subtitle || ''}
        </Typography>
        <Typography variant="h2" component="h2" sx={{
          color: '#ffffff',
          fontSize: { xs: '24px', sm: '3rem', md: '4.5rem' },
          lineHeight: 1.2,
          fontFamily: "'DM Serif Display', serif",
          fontWeight: 400,
          mb: { xs: '14px', md: 4 },
          maxWidth: { xs: '223px', md: '600px' }
        }}>
          {activeSlide.title || ''}
        </Typography>
        <Typography variant="body1" sx={{
          color: '#ffffff',
          maxWidth: { xs: '252px', md: '600px' },
          mb: { xs: '14px', md: 4 },
          fontSize: { xs: '12px', md: '1.1rem' },
          lineHeight: 1.5,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400
        }}>
          {activeSlide.description}
        </Typography>
        <Button
          variant="contained"
          sx={{
            padding: { xs: '8px 16px', md: '14px 32px' },
            fontSize: { xs: '12px', md: '1rem' },
            backgroundColor: '#17badf',
            color: 'white',
            textTransform: 'none',
            borderRadius: '2px',
            height: { xs: '32px', md: 'auto' },
            minWidth: { xs: '107px', md: 'auto' },
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            gap: '6px',
            '&:hover': {
              backgroundColor: '#0d90ad',
            }
          }}
          href={activeSlide.button_link || '#'}
          endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: '12px', md: '20px' } }} />}
        >
          {activeSlide.button_text}
        </Button>
      </Box>

      {/* Carousel Indicators */}
      {slides.length > 1 && (
        <Box sx={{
          position: 'absolute',
          bottom: { xs: '8px', md: '2rem' },
          left: { xs: '16px', md: '50%' },
          transform: { xs: 'none', md: 'translateX(-50%)' },
          zIndex: 1,
          display: 'flex',
          gap: { xs: '3.813px', md: '8px' },
        }}>
          {slides.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: currentSlide === index ? '27.958px' : '12.073px', md: 8 },
                height: { xs: '5.083px', md: 8 },
                borderRadius: { xs: '3.813px', md: '50%' },
                backgroundColor: 'white',
                opacity: currentSlide === index ? 1 : 0.5,
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
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
