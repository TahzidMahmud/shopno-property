import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { investmentBenefitService } from '../services/homePageService';
import { InvestmentBenefit } from '../types/HomePage';

// Icon mapping to Figma SVG files
const iconMap: Record<string, string> = {
  BarChart: '/assets/icons/chart.svg',
  Storage: '/assets/icons/database.svg',
  Hub: '/assets/icons/filters.svg',
  ArrowUpward: '/assets/icons/arrow-up.svg',
  Chart: '/assets/icons/chart.svg',
  Database: '/assets/icons/database.svg',
  Filters: '/assets/icons/filters.svg',
  Arrow: '/assets/icons/arrow-up.svg',
};

// Icon component that renders SVG with proper styling
const BenefitIcon: React.FC<{ iconName: string }> = ({ iconName }) => {
  const iconPath = iconMap[iconName] || iconMap['BarChart'];

  return (
    <Box
      component="img"
      src={iconPath}
      alt={iconName}
      sx={{
        width: '40px',
        height: '40px',
        objectFit: 'contain',
      }}
    />
  );
};

export default function WhyInvest() {
  const [benefits, setBenefits] = useState<InvestmentBenefit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBenefits();
  }, []);

  const loadBenefits = async () => {
    try {
      const data = await investmentBenefitService.getAll();
      const sortedBenefits = data.sort((a, b) => a.order - b.order);
      setBenefits(sortedBenefits);
    } catch (error) {
      console.error('Error loading investment benefits:', error);
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
      bgcolor: '#f8fdff',
      overflow: 'hidden'
    }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        mb: { xs: 3, md: 4 },
        gap: { xs: '12px', md: 0 }
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '8px', md: '14px' }, flex: { xs: '1', md: '0 0 auto' }, maxWidth: { xs: '161px', md: '428px' }, width: { xs: '100%', md: 'auto' } }}>
          {/* Reson For you Label */}
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
              Reson For you
            </Typography>
            <Box sx={{
              width: { xs: '8px', md: '12px' },
              height: { xs: '8px', md: '12px' },
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: '#411f57',
            }} />
          </Box>

          {/* Title with Estate? Badge */}
          <Box sx={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            gap: { xs: '4px', md: 0 },
            width: '100%',
            maxWidth: { xs: '161px', md: '100%' }
          }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: { xs: '20px', md: '35px' },
              lineHeight: 1.3,
              color: '#272222',
              textTransform: 'capitalize',
              display: 'inline-block',
              width: { xs: '100%', md: 'auto' },
            }}>
              Why should you invest in real{' '}
            </Typography>
            <Box sx={{
              display: 'inline-block',
              bgcolor: '#17badf',
              color: '#fafafa',
              px: { xs: '9.594px', md: '14px' },
              py: { xs: '6.853px', md: '10px' },
              borderRadius: { xs: '1.802px', md: '4px' },
              transform: { xs: 'rotate(3.063deg)', md: 'rotate(4.4deg)' },
              ml: { xs: 0, md: '4px' },
              flexShrink: 0,
              alignSelf: { xs: 'flex-start', md: 'center' },
            }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: { xs: '13.706px', md: '32px' },
                lineHeight: 1.2,
                color: '#fafafa',
                whiteSpace: 'nowrap',
              }}>
                Estate?
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        <Typography sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: { xs: '12px', md: '18px' },
          lineHeight: 1.5,
          color: '#737373',
          maxWidth: { xs: '277px', md: '300px' },
          textAlign: { xs: 'left', md: 'right' },
          flex: { xs: '1', md: '0 0 auto' }
        }}>
          Get into the most profitable investment industry and turn your idle money into profits.
        </Typography>
      </Box>

      {/* Benefits Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: { xs: '12px', md: '20px' },
        overflow: 'hidden'
      }}>
        {benefits.map((benefit) => (
          <Box
            key={benefit.id}
            sx={{
              border: '0.74px solid #d8d8d8',
              borderRadius: '5.923px',
              bgcolor: '#f9fbfe',
              height: { xs: 'auto', md: '260px' },
              p: { xs: '14px', md: '14.26px' },
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Icon Box */}
            <Box sx={{
              width: '45px',
              height: '45px',
              bgcolor: 'rgba(23,186,223,0.06)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BenefitIcon iconName={benefit.icon_name} />
            </Box>

            {/* Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: { xs: '16px', md: '18px' },
                lineHeight: 1.3,
                color: '#183b56',
              }}>
                {benefit.title}
              </Typography>
              <Typography sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.5,
                color: '#737373',
              }}>
                {benefit.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
