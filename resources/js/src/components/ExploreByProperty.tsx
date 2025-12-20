import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { propertyTypeService } from '../services/homePageService';
import { propertyService } from '../services/propertyService';
import { PropertyType } from '../types/HomePage';

interface PropertyTypeDisplay {
  id: number;
  name: string;
  typeValue: string;
  iconPath: string;
  count: number;
}

// Icon mapping - map property type names to Figma icon paths
const iconMap: Record<string, string> = {
  'Resort': '/assets/icons/property-resort.svg',
  'Modern Villa': '/assets/icons/property-villa.svg',
  'Villa': '/assets/icons/property-villa.svg',
  'Apartment': '/assets/icons/property-apartment.svg',
  'Commercial': '/assets/icons/property-commercial.svg',
  'Land Share': '/assets/icons/property-land-share.svg',
  'Land': '/assets/icons/property-land-share.svg',
  'Hotel': '/assets/icons/property-hotel.svg',
};

export default function ExploreByProperty() {
  const navigate = useNavigate();
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    loadPropertyTypes();
  }, []);

  const loadPropertyTypes = async () => {
    try {
      // Fetch configured property types from admin
      const configuredTypes = await propertyTypeService.getAll();

      // Fetch all properties to calculate counts
      const properties = await propertyService.getAll();

      // Count properties by type
      const typeCounts: Record<string, number> = {};
      properties.forEach(property => {
        if (property.type) {
          const type = property.type.toLowerCase();
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        }
      });

      // Map configured types to display format
      const displayTypes: PropertyTypeDisplay[] = configuredTypes
        .filter(type => type.is_active) // Only show active types
        .map(type => ({
          id: type.id!,
          name: type.name,
          typeValue: type.type_value,
          iconPath: iconMap[type.name] || iconMap['Apartment'] || '/assets/icons/property-apartment.svg',
          count: typeCounts[type.type_value.toLowerCase()] || 0,
        }))
        .sort((a, b) => b.count - a.count) // Sort by count descending
        .slice(0, 6); // Show top 6

      // If no configured types, show default fallback
      if (displayTypes.length === 0) {
        setPropertyTypes([
          { id: 1, name: 'Resort', typeValue: 'resort', iconPath: iconMap['Resort'] || '/assets/icons/property-resort.svg', count: typeCounts['resort'] || 0 },
          { id: 2, name: 'Modern Villa', typeValue: 'villa', iconPath: iconMap['Modern Villa'] || '/assets/icons/property-villa.svg', count: typeCounts['villa'] || 0 },
          { id: 3, name: 'Apartment', typeValue: 'apartment', iconPath: iconMap['Apartment'] || '/assets/icons/property-apartment.svg', count: typeCounts['apartment'] || 0 },
          { id: 4, name: 'Commercial', typeValue: 'commercial', iconPath: iconMap['Commercial'] || '/assets/icons/property-commercial.svg', count: typeCounts['commercial'] || 0 },
          { id: 5, name: 'Land Share', typeValue: 'land', iconPath: iconMap['Land Share'] || '/assets/icons/property-land-share.svg', count: typeCounts['land'] || typeCounts['land share'] || 0 },
          { id: 6, name: 'Hotel', typeValue: 'hotel', iconPath: iconMap['Hotel'] || '/assets/icons/property-hotel.svg', count: typeCounts['hotel'] || 0 },
        ]);
      } else {
        setPropertyTypes(displayTypes);
      }
    } catch (error) {
      console.error('Error loading property types:', error);
      // Set default types on error
      setPropertyTypes([
        { id: 1, name: 'Resort', typeValue: 'resort', iconPath: '/assets/icons/property-resort.svg', count: 0 },
        { id: 2, name: 'Modern Villa', typeValue: 'villa', iconPath: '/assets/icons/property-villa.svg', count: 0 },
        { id: 3, name: 'Apartment', typeValue: 'apartment', iconPath: '/assets/icons/property-apartment.svg', count: 0 },
        { id: 4, name: 'Commercial', typeValue: 'commercial', iconPath: '/assets/icons/property-commercial.svg', count: 0 },
        { id: 5, name: 'Land Share', typeValue: 'land', iconPath: '/assets/icons/property-land-share.svg', count: 0 },
        { id: 6, name: 'Hotel', typeValue: 'hotel', iconPath: '/assets/icons/property-hotel.svg', count: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: '4rem', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      py: { xs: '3rem', md: '4rem' },
      px: { xs: '16px', md: '120px' },
      maxWidth: 'lg',
      mx: 'auto',
      bgcolor: 'white'
    }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        mb: { xs: 3, md: '60px' },
        gap: { xs: '12px', md: 0 }
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '8px', md: '10px' }, flex: { xs: '1', md: '0 0 auto' }, maxWidth: { xs: '161px', md: '356px' } }}>
          {/* Property Type Label */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '7.5px' }}>
            <Box sx={{
              width: { xs: '8px', md: '12px' },
              height: { xs: '8px', md: '12px' },
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: '#411f57',
            }} />
            <Typography sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: { xs: '10px', md: '14px' },
              lineHeight: 1.2,
              color: '#411f57'
            }}>
              Property Type
            </Typography>
            <Box sx={{
              width: { xs: '8px', md: '12px' },
              height: { xs: '8px', md: '12px' },
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: '#411f57',
            }} />
          </Box>

          {/* Title with Type Badge */}
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: { xs: '20px', md: '40px' },
              lineHeight: 1.3,
              color: '#272222',
              textTransform: 'capitalize',
              display: 'inline',
              whiteSpace: 'nowrap',
            }}>
              Explore By Property{' '}
            </Typography>
            <Box sx={{
              display: 'inline-block',
              bgcolor: '#17badf',
              color: '#fafafa',
              px: { xs: '9.594px', md: '14px' },
              py: { xs: '6.853px', md: '10px' },
              borderRadius: { xs: '1.802px', md: '4px' },
              transform: 'rotate(3.063deg)',
              ml: '4px',
              flexShrink: 0,
            }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: { xs: '13.706px', md: '32px' },
                lineHeight: 1.2,
                color: '#fafafa',
                whiteSpace: 'nowrap',
              }}>
                Type
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Subtitle */}
        <Typography sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: { xs: '12px', md: '18px' },
          lineHeight: 1.5,
          color: '#737373',
          maxWidth: { xs: '218px', md: '279px' },
          textAlign: { xs: 'left', md: 'right' },
          flex: { xs: '1', md: '0 0 auto' }
        }}>
          Explore homes, apartments, and villas tailored to you
        </Typography>
      </Box>

      {/* Property Types Container */}
      <Box sx={{
        bgcolor: '#411f57',
        borderRadius: '8px',
        p: { xs: '20px 0', md: '40px' },
        position: 'relative',
      }}>
        {propertyTypes.length > 1 && (
          <>
            <IconButton
              onClick={() => sliderRef.current?.slickPrev()}
              sx={{
                position: 'absolute',
                left: { xs: '15px', md: '25px' },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'white',
                border: '1px solid #411f57',
                color: '#411f57',
                '&:hover': {
                  bgcolor: '#f0f0f0',
                },
                width: { xs: '32px', md: '40px' },
                height: { xs: '32px', md: '40px' },
              }}
            >
              <ArrowBackIos sx={{ fontSize: { xs: '16px', md: '20px' } }} />
            </IconButton>
            <IconButton
              onClick={() => sliderRef.current?.slickNext()}
              sx={{
                position: 'absolute',
                right: { xs: '10px', md: '20px' },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'white',
                border: '1px solid #411f57',
                color: '#411f57',
                '&:hover': {
                  bgcolor: '#f0f0f0',
                },
                width: { xs: '32px', md: '40px' },
                height: { xs: '32px', md: '40px' },

              }}
            >
              <ArrowForwardIos sx={{ fontSize: { xs: '16px', md: '20px' } }} />
            </IconButton>
          </>
        )}

        <Box sx={{
          width: '100%',
          maxWidth: '1176px',
          mx: 'auto',
          overflow: 'hidden',
          '& .slick-slide': {
            '& > div': {
              display: 'flex',
              justifyContent: 'center',
            },
          },
          '& .slick-list': {
            margin: { xs: '0 -8px', md: '0 -12px' },
            overflow: 'visible',
          },
          '& .slick-slide > div': {
            padding: { xs: '0 8px', md: '0 12px' },
          },
          '@media (max-width: 600px)': {
            '& .slick-slide': {
              width: '100% !important',
            },
            '& .slick-track': {
              display: 'flex !important',
            },
          },
        }}>
          <Slider
            ref={sliderRef}
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={propertyTypes.length <= 4 ? propertyTypes.length : 4}
            slidesToScroll={1}
            arrows={false}
            variableWidth={false}
            centerMode={false}
            swipeToSlide={true}
            responsive={[
              {
                breakpoint: 960,
                settings: {
                  slidesToShow: propertyTypes.length <= 3 ? propertyTypes.length : 3,
                  slidesToScroll: 1,
                },
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  variableWidth: false,
                },
              },
            ]}
          >
            {propertyTypes.map(type => (
              <div key={type.id}>
                <Box
                  onClick={() => navigate(`/projects?type=${encodeURIComponent(type.typeValue)}`)}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: { xs: '4px', md: '8px' },
                    width: { xs: '164.043px', md: '270px' },
                    maxWidth: { xs: '164.043px', md: '270px' },
                    height: { xs: '177.092px', md: '190px' },
                    minHeight: { xs: '177.092px', md: '190px' },
                    p: { xs: '27.96px', md: '30px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: { xs: '21.438px', md: '23px' },
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    flexShrink: 0,
                    boxSizing: 'border-box',
                    mx: { xs: 'auto', md: 0 },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                {/* Icon Box */}
                <Box sx={{
                  width: { xs: '55.924px', md: '60px' },
                  height: { xs: '55.924px', md: '60px' },
                  bgcolor: '#effbfe',
                  borderRadius: { xs: '7.457px', md: '8px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Box
                    component="img"
                    src={type.iconPath}
                    alt={type.name}
                    sx={{
                      width: { xs: '37.301px', md: '40px' },
                      height: { xs: '37.283px', md: '40px' },
                      transform: 'scaleY(-1)', // Flip vertically as per Figma
                    }}
                  />
                </Box>

                {/* Content */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '3.728px', md: '4px' }, alignItems: 'center' }}>
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: { xs: '18.641px', md: '20px' },
                    lineHeight: 1.2,
                    color: '#1c1c1c',
                  }}>
                    {type.name}
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: '14.913px', md: '16px' },
                    lineHeight: 1.2,
                    color: '#737373',
                  }}>
                    {type.count} {type.count === 1 ? 'Property' : 'Properties'}
                  </Typography>
                </Box>
              </Box>
              </div>
            ))}
          </Slider>
        </Box>
      </Box>
    </Box>
  );
}
