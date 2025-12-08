import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import Slider from 'react-slick';
import { partnerService } from '../services/homePageService';
import { Partner } from '../types/HomePage';

export default function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const data = await partnerService.getAll();
      const activePartners = data
        .filter(partner => partner.is_active)
        .sort((a, b) => a.order - b.order);
      setPartners(activePartners);
    } catch (error) {
      console.error('Error loading partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return '/assets/partner-logo-1.png';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4, lg: 8 }, backgroundColor: 'white' }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto', textAlign: 'center' }}>
        {/* Title Section */}
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 6, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          We Are Partners{' '}
          <Box component="span" sx={{ backgroundColor: '#00bcd4', color: 'white', px: 1.5, py: 0.5, borderRadius: '4px', transform: 'rotate(-5deg)', display: 'inline-block' }}>
            With
          </Box>
        </Typography>

        {/* Partner Logos Carousel */}
        <Slider {...sliderSettings}>
          {partners.map(partner => (
            <Box key={partner.id} sx={{
              p: 2,
              display: 'flex !important',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 100,
            }}>
              <Box
                component="img"
                src={getImageUrl(partner.logo)}
                alt={partner.name}
                sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
