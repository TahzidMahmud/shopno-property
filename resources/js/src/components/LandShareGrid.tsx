import React, { useContext, useState, useRef } from 'react';
import { Box, Typography, Button, IconButton, Stack } from '@mui/material';
import Slider from 'react-slick';
import PropertyCard from './PropertyCard';
import { PropertyContext } from '../context/PropertyContext';
import PropertyDetailDialog from './PropertyDetailDialog';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function LandShareGrid() {
  const { properties } = useContext(PropertyContext);
  const [openId, setOpenId] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const settings = {
    dots: false, // Disable default dots
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <></>, // Hide default arrows
    prevArrow: <></>, // Hide default arrows
    beforeChange: (oldIndex: number, newIndex: number) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0
        }
      }
    ]
  };

  return (
    <Box sx={{ py: '4rem', px: { xs: 2, md: 5 }, maxWidth: 'lg', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#9c27b0', mr: 1 }} />
            <Typography variant="body1" sx={{ color: '#9c27b0', fontWeight: 500 }}>
              Land Share
            </Typography>
          </Box>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            Search <Box component="span" sx={{ bgcolor: '#00bcd4', color: 'white', px: 1, borderRadius: '4px' }}>Perfect</Box>
            <br />
            Land Share
          </Typography>
        </Box>
        <Button variant="outlined" color="primary" sx={{ textTransform: 'none', borderColor: '#00bcd4', color: '#00bcd4' }}>
          View All <ArrowForwardIosIcon sx={{ fontSize: 16, ml: 0.5 }} />
        </Button>
      </Box>

      <Box sx={{ position: 'relative', minHeight: 350 }}>
        <Slider ref={sliderRef} {...settings}>
          {properties.map(p => (
            <Box key={p.id} sx={{ px: 1 }}>
              <PropertyCard property={p} onOpen={(id) => setOpenId(id)} />
            </Box>
          ))}
        </Slider>

        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
          <IconButton onClick={handlePrev} disabled={currentSlide === 0} sx={{ color: '#00bcd4' }}>
            <ArrowBackIosIcon />
          </IconButton>
          {properties.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: currentSlide === index ? 30 : 10,
                height: 10,
                borderRadius: currentSlide === index ? '5px' : '50%',
                bgcolor: currentSlide === index ? '#00bcd4' : '#d3d3d3',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => sliderRef.current?.slickGoTo(index)}
            />
          ))}
          <IconButton onClick={handleNext} disabled={currentSlide === properties.length - settings.slidesToShow} sx={{ color: '#00bcd4' }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Stack>
      </Box>

      <PropertyDetailDialog
        open={openId !== null}
        id={openId}
        onClose={() => setOpenId(null)}
      />
    </Box>
  );
}
