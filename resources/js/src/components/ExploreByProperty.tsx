import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { propertyTypeService } from '../services/homePageService';
import { propertyService } from '../services/propertyService';
import { PropertyType } from '../types/HomePage';

interface PropertyTypeDisplay {
  id: number;
  name: string;
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
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeDisplay[]>([]);
  const [loading, setLoading] = useState(true);

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
          iconPath: iconMap[type.name] || iconMap['Apartment'] || '/assets/icons/property-apartment.svg',
          count: typeCounts[type.type_value.toLowerCase()] || 0,
        }))
        .sort((a, b) => b.count - a.count) // Sort by count descending
        .slice(0, 6); // Show top 6

      // If no configured types, show default fallback
      if (displayTypes.length === 0) {
        setPropertyTypes([
          { id: 1, name: 'Resort', iconPath: iconMap['Resort'] || '/assets/icons/property-resort.svg', count: typeCounts['resort'] || 0 },
          { id: 2, name: 'Modern Villa', iconPath: iconMap['Modern Villa'] || '/assets/icons/property-villa.svg', count: typeCounts['villa'] || 0 },
          { id: 3, name: 'Apartment', iconPath: iconMap['Apartment'] || '/assets/icons/property-apartment.svg', count: typeCounts['apartment'] || 0 },
          { id: 4, name: 'Commercial', iconPath: iconMap['Commercial'] || '/assets/icons/property-commercial.svg', count: typeCounts['commercial'] || 0 },
          { id: 5, name: 'Land Share', iconPath: iconMap['Land Share'] || '/assets/icons/property-land-share.svg', count: typeCounts['land'] || typeCounts['land share'] || 0 },
          { id: 6, name: 'Hotel', iconPath: iconMap['Hotel'] || '/assets/icons/property-hotel.svg', count: typeCounts['hotel'] || 0 },
        ]);
      } else {
        setPropertyTypes(displayTypes);
      }
    } catch (error) {
      console.error('Error loading property types:', error);
      // Set default types on error
      setPropertyTypes([
        { id: 1, name: 'Resort', iconPath: '/assets/icons/property-resort.svg', count: 0 },
        { id: 2, name: 'Modern Villa', iconPath: '/assets/icons/property-villa.svg', count: 0 },
        { id: 3, name: 'Apartment', iconPath: '/assets/icons/property-apartment.svg', count: 0 },
        { id: 4, name: 'Commercial', iconPath: '/assets/icons/property-commercial.svg', count: 0 },
        { id: 5, name: 'Land Share', iconPath: '/assets/icons/property-land-share.svg', count: 0 },
        { id: 6, name: 'Hotel', iconPath: '/assets/icons/property-hotel.svg', count: 0 },
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
      px: { xs: 2, md: '120px' },
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
        gap: { xs: 2, md: 0 }
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: { xs: '1', md: '0 0 auto' }, maxWidth: { xs: '100%', md: '356px' } }}>
          {/* Property Type Label */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '7.5px' }}>
            <Box sx={{
              width: '12px',
              height: '12px',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: '#411f57',
            }} />
            <Typography sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: 1.2,
              color: '#411f57'
            }}>
              Property Type
            </Typography>
            <Box sx={{
              width: '12px',
              height: '12px',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: '#411f57',
            }} />
          </Box>

          {/* Title with Type Badge */}
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: { xs: '30px', md: '40px' },
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
              px: '14px',
              py: '10px',
              borderRadius: '4px',
              transform: 'rotate(4.4deg)',
              ml: '4px',
              flexShrink: 0,
            }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: { xs: '28px', md: '32px' },
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
          fontSize: { xs: '16px', md: '18px' },
          lineHeight: 1.5,
          color: '#737373',
          maxWidth: { xs: '100%', md: '279px' },
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
        p: { xs: 2, md: '40px' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
          gap: { xs: 2, md: '24px' },
          width: '100%',
          maxWidth: '1176px',
        }}>
          {propertyTypes.map(type => (
            <Box
              key={type.id}
              sx={{
                bgcolor: 'white',
                borderRadius: '8px',
                width: { xs: '100%', md: '176px' },
                height: { xs: 'auto', md: '190px' },
                minHeight: { xs: '160px', md: '190px' },
                p: { xs: '20px', md: '30px' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: '16px', md: '23px' },
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {/* Icon Box */}
              <Box sx={{
                width: { xs: '50px', md: '60px' },
                height: { xs: '50px', md: '60px' },
                bgcolor: '#effbfe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Box
                  component="img"
                  src={type.iconPath}
                  alt={type.name}
                  sx={{
                    width: { xs: '35px', md: '40px' },
                    height: { xs: '35px', md: '40px' },
                    transform: 'scaleY(-1)', // Flip vertically as per Figma
                  }}
                />
              </Box>

              {/* Content */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: { xs: '18px', md: '20px' },
                  lineHeight: 1.2,
                  color: '#1c1c1c',
                }}>
                  {type.name}
                </Typography>
                <Typography sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: { xs: '14px', md: '16px' },
                  lineHeight: 1.2,
                  color: '#737373',
                }}>
                  {type.count} {type.count === 1 ? 'Property' : 'Properties'}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
