import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
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
    <Box sx={{ pt: { xs: '3rem', md: '3rem' },pb:'4rem', px: { xs: 2, md: '120px' }, maxWidth: 'lg', mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        mb: { xs: 3, md: 4 },
        gap: { xs: 2, md: 0 }
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: { xs: '1 1 100%', md: '0 0 auto' }, maxWidth: { xs: '100%', md: '356px' } }}>
          {/* Property Size Label */}
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
              Property Size
            </Typography>
            <Box sx={{
              width: '12px',
              height: '12px',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: '#411f57',
            }} />
          </Box>

          {/* Title with Comfort Badge */}
          <Box sx={{ position: 'relative', display: 'inline-block', width: { xs: '100%', md: '356px' } }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: { xs: '32px', md: '40px' },
              lineHeight: 1.3,
              color: '#272222',
              textTransform: 'capitalize',
              display: 'inline-block',
            }}>
              Perfect Size, Perfect
            </Typography>
            <Box sx={{
              position: 'absolute',
              left: { xs: '0px', md: '156px' },
              top: { xs: '40px', md: '50.8px' },
              bgcolor: '#17badf',
              color: '#fafafa',
              px: '14px',
              py: '10px',
              borderRadius: '4px',
              transform: 'rotate(4.4deg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '42px',
              minWidth: { xs: '140px', md: '159.759px' }
            }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: '32px',
                lineHeight: 1.2,
                color: '#fafafa',
                whiteSpace: 'nowrap'
              }}>
                Comfort
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* View All Button */}
        <Button
          variant="outlined"
          onClick={handleViewAll}
          sx={{
            border: '1px solid #17badf',
            color: '#17badf',
            textTransform: 'none',
            px: '24px',
            py: '12px',
            borderRadius: '4px',
            height: '50px',
            minWidth: { xs: '100%', md: '155px' },
            fontSize: '20px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            lineHeight: 1.2,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            position: 'relative',
            '&:hover': {
              borderColor: '#17badf',
              backgroundColor: 'rgba(23, 186, 223, 0.04)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-1px',
              left: '-1px',
              width: '2px',
              height: '0',
            }
          }}
        >
          View All
          <ArrowOutwardIcon sx={{ fontSize: '20.714px', transform: 'rotate(2.085deg)' }} />
        </Button>
      </Box>

      {/* Property Cards Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: { xs: '20px', md: '14.004px' },
        mt: { xs: 3, md: 4 }
      }}>
        {properties.map(p => (
          <PropertyCard
            key={p.id}
            property={p}
            onOpen={(id) => navigate(`/property-details/${id}`)}
          />
        ))}
      </Box>
    </Box>
  );
}
