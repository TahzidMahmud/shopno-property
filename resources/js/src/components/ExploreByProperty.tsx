import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HouseIcon from '@mui/icons-material/House';
import StoreIcon from '@mui/icons-material/Store';
import LandscapeIcon from '@mui/icons-material/Landscape';
import HotelIcon from '@mui/icons-material/Hotel';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import { propertyTypeService } from '../services/homePageService';
import { propertyService } from '../services/propertyService';
import { PropertyType } from '../types/HomePage';

interface PropertyTypeDisplay {
  id: number;
  name: string;
  icon: React.ReactElement;
  count: number;
}

// Icon mapping
const iconMap: Record<string, React.ReactElement> = {
  'ApartmentIcon': <ApartmentIcon sx={{ fontSize: 50, color: 'info.light' }} />,
  'HouseIcon': <HouseIcon sx={{ fontSize: 50, color: 'info.light' }} />,
  'StoreIcon': <StoreIcon sx={{ fontSize: 50, color: 'info.light' }} />,
  'LandscapeIcon': <LandscapeIcon sx={{ fontSize: 50, color: 'info.light' }} />,
  'HotelIcon': <HotelIcon sx={{ fontSize: 50, color: 'info.light' }} />,
  'HolidayVillageIcon': <HolidayVillageIcon sx={{ fontSize: 50, color: 'info.light' }} />,
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
          icon: iconMap[type.icon_name] || <HouseIcon sx={{ fontSize: 50, color: 'info.light' }} />,
          count: typeCounts[type.type_value.toLowerCase()] || 0,
        }))
        .sort((a, b) => b.count - a.count) // Sort by count descending
        .slice(0, 6); // Show top 6

      // If no configured types, show default fallback
      if (displayTypes.length === 0) {
        setPropertyTypes([
          { id: 1, name: 'Resort', icon: <HolidayVillageIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: typeCounts['resort'] || 0 },
          { id: 2, name: 'Modern Villa', icon: <HouseIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: typeCounts['villa'] || 0 },
          { id: 3, name: 'Apartment', icon: <ApartmentIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: typeCounts['apartment'] || 0 },
          { id: 4, name: 'Commercial', icon: <StoreIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: typeCounts['commercial'] || 0 },
          { id: 5, name: 'Land Share', icon: <LandscapeIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: typeCounts['land'] || typeCounts['land share'] || 0 },
          { id: 6, name: 'Hotel', icon: <HotelIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: typeCounts['hotel'] || 0 },
        ]);
      } else {
        setPropertyTypes(displayTypes);
      }
    } catch (error) {
      console.error('Error loading property types:', error);
      // Set default types on error
      setPropertyTypes([
        { id: 1, name: 'Resort', icon: <HolidayVillageIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: 0 },
        { id: 2, name: 'Modern Villa', icon: <HouseIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: 0 },
        { id: 3, name: 'Apartment', icon: <ApartmentIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: 0 },
        { id: 4, name: 'Commercial', icon: <StoreIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: 0 },
        { id: 5, name: 'Land Share', icon: <LandscapeIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: 0 },
        { id: 6, name: 'Hotel', icon: <HotelIcon sx={{ fontSize: 50, color: 'info.light' }} />, count: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 12, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 12, px: { xs: 2, md: 4, lg: 8 }, backgroundColor: '#4A148C', color: 'white' }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: 8, height: 8, backgroundColor: 'purple.300', transform: 'rotate(45deg)', mr: 0.5 }} />
          <Typography variant="body2" sx={{ color: 'purple.300', fontWeight: 'semibold' }}>
            Property Type
          </Typography>
          <Box sx={{ width: 8, height: 8, backgroundColor: 'purple.300', transform: 'rotate(45deg)', ml: 0.5 }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'white' }}>
            Explore By{' '}
            <Box component="span" sx={{ backgroundColor: 'info.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, transform: 'rotate(-6deg)', display: 'inline-block' }}>
              Property Type
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.300', maxWidth: '300px', textAlign: 'right' }}>
            Explore homes, apartments, and villas tailored to you
          </Typography>
        </Box>

        {/* Property Types Grid */}
        <Grid container spacing={4} justifyContent="center">
          {propertyTypes.map(type => (
            <Grid item xs={12} sm={6} md={2} key={type.id}>
              <Paper sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: 'white',
                color: 'text.primary',
                height: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}>
                {type.icon}
                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>{type.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {type.count} {type.count === 1 ? 'Property' : 'Properties'}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
