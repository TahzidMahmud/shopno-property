import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import { Property } from '../types/Property';
import { propertyService } from '../services/propertyService';

export default function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertyService.getAll();
      // Show only first 6 properties
      setProperties(data.slice(0, 6));
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    navigate('/projects');
  };

  if (loading) {
    return (
      <Box sx={{ py: '4rem', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: '4rem', px: { xs: 2, md: 8 }, maxWidth: 'lg', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <HomeIcon sx={{ fontSize: '1rem', color: 'secondary.main', mr: 0.5 }} />
            Property Size
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            Perfect Size,<br />Perfect <Box component="span" sx={{ bgcolor: 'info.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, transform: 'rotate(-5deg)', display: 'inline-block', ml: 1 }}>Comfort</Box>
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          sx={{ color: 'info.main', borderColor: 'info.main' }} 
          endIcon={<ArrowForwardIcon sx={{ color: 'info.main' }} />}
          onClick={handleViewAll}
        >
          View All
        </Button>
      </Box>

      <Grid container spacing={2}>
        {properties.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <PropertyCard 
              property={p} 
              onOpen={(id) => navigate(`/property-details/${id}`)} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
