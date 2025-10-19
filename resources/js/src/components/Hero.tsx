import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SearchForm from './SearchForm';

const heroSlides = [
  {
    id: 1,
    backgroundImage: '/assets/house1.jpg', // Use an existing image path
    title: 'Innovating Concepts of Living',
    subtitle: 'Designing for the Future',
    description: 'We help you find safe homes, secure investments, and the perfect property solutions with trust, transparency, and care.',
    buttonText: 'About Us',
  },
  {
    id: 2,
    backgroundImage: 'https://via.placeholder.com/1500x700?text=Hero+Image+2',
    title: 'Your Dream Home Awaits',
    subtitle: 'Explore Our Exclusive Properties',
        description: 'Discover a wide range of properties tailored to your needs, from luxurious villas to modern apartments.',
    buttonText: 'View Properties',
  },
  {
    id: 3,
    backgroundImage: 'https://via.placeholder.com/1500x700?text=Hero+Image+3',
    title: 'Invest in Your Future',
    subtitle: 'Secure Your Tomorrow Today',
    description: 'Find lucrative investment opportunities in real estate with expert guidance and comprehensive support.',
    buttonText: 'Why Invest?',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <Box sx={{
      position: 'relative',
      height: '700px',
      backgroundImage: `url(${activeSlide.backgroundImage})`,
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
        <Button variant="contained" color="primary" sx={{ padding: '12px 30px', fontSize: '1rem' }}>
          {activeSlide.buttonText} <Box component="span" sx={{ ml: 1 }}>&#8599;</Box>
        </Button>
      </Box>

      {/* Carousel Indicators */}
      <Box sx={{
        position: 'absolute',
        bottom: '2rem',
        right: '4rem',
        zIndex: 1,
        display: 'flex',
        gap: '10px',
      }}>
        {heroSlides.map((_, index) => (
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
    </Box>
  );
}
