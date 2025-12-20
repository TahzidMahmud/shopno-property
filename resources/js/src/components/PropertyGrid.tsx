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
    <Box sx={{ pt: { xs: '3rem', md: '3rem' },pb:'4rem', px: { xs: '16px', md: '120px' }, maxWidth: 'lg', mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        mb: { xs: 3, md: 4 },
        gap: { xs: '12px', md: 0 }
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '8px', md: '10px' }, flex: { xs: '1 1 100%', md: '0 0 auto' }, maxWidth: { xs: '161px', md: '356px' } }}>
          {/* Property Size Label */}
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
              Property Size
            </Typography>
            <Box sx={{
              width: { xs: '8px', md: '12px' },
              height: { xs: '8px', md: '12px' },
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: '#411f57',
            }} />
          </Box>

          {/* Title with Comfort Badge */}
          <Box sx={{ position: 'relative', display: 'inline-block', width: { xs: '161px', md: '356px' } }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: { xs: '20px', md: '40px' },
              lineHeight: 1.3,
              color: '#272222',
              textTransform: 'capitalize',
              display: 'inline-block',
            }}>
              Perfect Size, Perfect
            </Typography>
            <Box sx={{
              position: 'absolute',
              left: { xs: '78.97px', md: '156px' },
              top: { xs: '25.84px', md: '50.8px' },
              bgcolor: '#17badf',
              color: '#fafafa',
              px: { xs: '9.594px', md: '14px' },
              py: { xs: '6.853px', md: '10px' },
              borderRadius: { xs: '1.802px', md: '4px' },
              transform: 'rotate(3.063deg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: { xs: '21.93px', md: '42px' },
              minWidth: { xs: '73.329px', md: '159.759px' }
            }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: { xs: '13.706px', md: '32px' },
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
            border: '0.549px solid #17badf',
            color: '#17badf',
            textTransform: 'none',
            px: { xs: '12px', md: '24px' },
            py: { xs: '6px', md: '12px' },
            borderRadius: '2px',
            height: { xs: '27px', md: '50px' },
            minWidth: { xs: '79px', md: '155px' },
            fontSize: { xs: '12px', md: '20px' },
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            lineHeight: 1.2,
            display: 'flex',
            alignItems: 'center',
            gap: { xs: '4px', md: '10px' },
            position: 'relative',
            '&:hover': {
              borderColor: '#17badf',
              backgroundColor: 'rgba(23, 186, 223, 0.04)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-0.98px',
              left: '-0.55px',
              width: '1.097px',
              height: '0',
            }
          }}
        >
          View All
          <ArrowOutwardIcon sx={{ fontSize: { xs: '10.974px', md: '20.714px' }, transform: 'rotate(2.085deg)' }} />
        </Button>
      </Box>

      {/* Property Cards Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: { xs: '14px', md: '14.004px' },
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
