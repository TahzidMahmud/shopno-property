import React, { useContext, useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import PropertyCard from './PropertyCard';
import { PropertyContext } from '../context/PropertyContext';
import PropertyDetailDialog from './PropertyDetailDialog'; // Import PropertyDetailDialog

export default function PropertyGrid() {
  const { properties } = useContext(PropertyContext);
  const [openId, setOpenId] = useState<number | null>(null); // Add state for dialog

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
        <Button variant="outlined" sx={{ color: 'info.main', borderColor: 'info.main' }} endIcon={<ArrowForwardIcon sx={{ color: 'info.main' }} />}>View All</Button>
      </Box>

      <Grid container spacing={2}>
        {properties.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <PropertyCard property={p} onOpen={(id) => setOpenId(id)} /> {/* Pass onOpen prop */}
          </Grid>
        ))}
      </Grid>

      <PropertyDetailDialog // Add PropertyDetailDialog
        open={openId !== null}
        id={openId}
        onClose={() => setOpenId(null)}
      />
    </Box>
  );
}
