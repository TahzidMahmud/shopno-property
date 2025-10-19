import React from 'react';
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick'; // Import Slider component

export default function PartnersSection() {
  const partnerLogos = [
    { id: 1, name: 'BLHL', image: '/assets/partner-logo-1.png' },
    { id: 2, name: 'Matribhumi Developer', image: '/assets/partner-logo-2.png' },
    { id: 3, name: 'M/S Mine & Brother\'s', image: '/assets/partner-logo-3.png' },
    { id: 4, name: 'Matribhumi Resort', image: '/assets/partner-logo-4.png' },
    { id: 5, name: 'Matribhumi Holdings', image: '/assets/partner-logo-5.png' },
    { id: 6, name: 'Matribhumi Heart Care', image: '/assets/partner-logo-6.png' },
    { id: 7, name: 'Matribhumi Tours & Travels', image: '/assets/partner-logo-7.png' },
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6, // Show 6 logos at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Auto-slide every 2 seconds
    arrows: false, // Hide navigation arrows
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

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4, lg: 8 }, backgroundColor: 'white' }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto', textAlign: 'center' }}>
        {/* Title Section */}
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 6 }}>
          We Are Partners{' '}
          <Box component="span" sx={{ backgroundColor: 'info.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, transform: 'rotate(-6deg)', display: 'inline-block' }}>
            With
          </Box>
        </Typography>

        {/* Partner Logos Carousel */}
        <Slider {...sliderSettings}>
          {partnerLogos.map(partner => (
            <Box key={partner.id} sx={{
              p: 2,
              display: 'flex !important', // Important to override slick's display: block
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 100, // Fixed height for logo container
            }}>
              <Box
                component="img"
                src={partner.image}
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
