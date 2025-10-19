import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import HubIcon from '@mui/icons-material/Hub';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import HomeIcon from '@mui/icons-material/Home';

export default function WhyInvest() {
  return (
    <Box sx={{ py: '4rem', px: { xs: 2, md: 5 }, maxWidth: 'lg', mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-start' }, mb: 6 }}>
        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
          <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', color: 'secondary.main', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <HomeIcon sx={{ fontSize: '1rem', color: 'secondary.main', mr: 0.5 }} />
            Reson For you
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mt: 1 }}>
            Why Should You<br />Invest In Real <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, transform: 'rotate(-5deg)', display: 'inline-block', ml: 1 }}>Estate?</Box>
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300, textAlign: { xs: 'center', md: 'right' } }}>
          Get into the most profitable investment industry and turn your idle money into profits.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 4, textAlign: 'left', border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 2 }}>
            <BarChartIcon sx={{ fontSize: 48, mb: 2, color: '#00bcd4' }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#212121' }}>Capital Appreciation</Typography>
            <Typography variant="body2" color="#757575">
              Grow your investment with the potential for significant value increases over time in prime real estate markets.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 4, textAlign: 'left', border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 2 }}>
            <StorageIcon sx={{ fontSize: 48, mb: 2, color: '#00bcd4' }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#212121' }}>Passive Income</Typography>
            <Typography variant="body2" color="#757575">
              Grow your investment with the potential for significant value increases over time in prime real estate markets.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 4, textAlign: 'left', border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 2 }}>
            <HubIcon sx={{ fontSize: 48, mb: 2, color: '#00bcd4' }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#212121' }}>Store hold of Wealth</Typography>
            <Typography variant="body2" color="#757575">
              Grow your investment with the potential for significant value increases over time in prime real estate markets.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 4, textAlign: 'left', border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 2 }}>
            <ArrowUpwardIcon sx={{ fontSize: 48, mb: 2, color: '#00bcd4' }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#212121' }}>Hedge for Inflation</Typography>
            <Typography variant="body2" color="#757575">
              Grow your investment with the potential for significant value increases over time in prime real estate markets.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
