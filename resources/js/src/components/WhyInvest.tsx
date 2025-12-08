import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import HubIcon from '@mui/icons-material/Hub';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import HomeIcon from '@mui/icons-material/Home';
import { investmentBenefitService } from '../services/homePageService';
import { InvestmentBenefit } from '../types/HomePage';

// Icon mapping
const iconMap: Record<string, React.ReactElement> = {
  BarChart: <BarChartIcon sx={{ fontSize: 48, mb: 2, color: '#00bcd4' }} />,
  Storage: <StorageIcon sx={{ fontSize: 48, mb: 2, color: '#00bcd4' }} />,
  Hub: <HubIcon sx={{ fontSize: 48, mb: 2, color: '#00bcd4' }} />,
  ArrowUpward: <ArrowUpwardIcon sx={{ fontSize: 48, mb: 2, color: '#00bcd4' }} />,
  Diamond: <Box sx={{ width: 48, height: 48, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💎</Box>,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || <BarChartIcon sx={{ fontSize: 48, mb: 2, color: '#00bcd4' }} />;
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
    <Box sx={{ py: '4rem', px: { xs: 2, md: 5 }, maxWidth: 'lg', mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-start' }, mb: 6 }}>
        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
          <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', color: 'secondary.main', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <HomeIcon sx={{ fontSize: '1rem', color: 'secondary.main', mr: 0.5 }} />
            Reson For you
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mt: 1, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Why Should You<br />Invest In Real <Box component="span" sx={{ bgcolor: '#00bcd4', color: 'white', px: 1.5, py: 0.5, borderRadius: '4px', transform: 'rotate(-5deg)', display: 'inline-block', ml: 1 }}>Estate?</Box>
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300, textAlign: { xs: 'center', md: 'right' } }}>
          Get into the most profitable investment industry and turn your idle money into profits.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {benefits.map((benefit) => (
          <Grid item xs={12} sm={6} md={3} key={benefit.id}>
            <Paper sx={{ p: 4, textAlign: 'left', border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 2 }}>
              {getIcon(benefit.icon_name)}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#212121' }}>
                {benefit.title}
              </Typography>
              <Typography variant="body2" color="#757575">
                {benefit.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
