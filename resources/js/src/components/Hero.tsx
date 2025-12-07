import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
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
      <Box sx={{ height: '700px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
      height: '700px',
      backgroundImage: `url(${getImageUrl(activeSlide.background_image)})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      textAlign: 'left',
      paddingLeft: '10%',
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
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
          {activeSlide.subtitle}
        </Typography>
        <Typography variant="h1" component="h1" gutterBottom sx={{ color: '#ffffff', fontSize: '4.5rem', lineHeight: 1.2 }}>
          {activeSlide.title.split(' ').map((word, index) => (
            <React.Fragment key={index}>
              {word} {index === 1 && <br />}
            </React.Fragment>
          ))}
        </Typography>
        <Typography variant="body1" sx={{ color: '#ffffff', maxWidth: '500px', mb: 4 }}>
          {activeSlide.description}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ padding: '12px 30px', fontSize: '1rem' }}
          href={activeSlide.button_link || '#'}
        >
          {activeSlide.button_text} <Box component="span" sx={{ ml: 1 }}>&#8599;</Box>
        </Button>
      </Box>

      {/* Carousel Indicators */}
      {slides.length > 1 && (
        <Box sx={{
          position: 'absolute',
          bottom: '2rem',
          right: '4rem',
          zIndex: 1,
          display: 'flex',
          gap: '10px',
        }}>
          {slides.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: currentSlide === index ? 40 : 20,
                height: 8,
                borderRadius: '4px',
                backgroundColor: 'white',
                opacity: currentSlide === index ? 1 : 0.5,
                cursor: 'pointer',
                transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',
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
