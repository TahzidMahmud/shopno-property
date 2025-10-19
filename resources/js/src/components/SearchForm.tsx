import React, { useState } from 'react';
import { Box, Button, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchForm() {
  const [propertyClass, setPropertyClass] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [design, setDesign] = useState('');

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: SelectChangeEvent) => {
    setter(event.target.value as string);
  };

  return (
    <Box sx={{
      backgroundColor: '#ffffff',
      padding: 4,
      borderRadius: 2, // Even more rounded corners
      width: '90%',
      maxWidth: '1200px',
      boxShadow: '2px 5px 5px rgba(0, 0, 0, 0.25)', // Stronger, more diffused shadow
      zIndex: 0,
      margin: '0 auto', // Center the form
      marginY: '4rem'
    }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Project Status</InputLabel>
            <Select label="Project Status" value={propertyClass} onChange={handleChange(setPropertyClass)}>
              <MenuItem value=""><em>Under Construction</em></MenuItem>
              <MenuItem value={10}>Ready to Move</MenuItem>
              <MenuItem value={20}>Upcoming</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Property Type</InputLabel>
            <Select label="Property Type" value={propertyType} onChange={handleChange(setPropertyType)}>
              <MenuItem value=""><em>Villa</em></MenuItem>
              <MenuItem value={10}>Apartment</MenuItem>
              <MenuItem value={20}>Land</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Location</InputLabel>
            <Select label="Location" value={location} onChange={handleChange(setLocation)}>
              <MenuItem value=""><em>Gulshan</em></MenuItem>
              <MenuItem value={10}>Banani</MenuItem>
              <MenuItem value={20}>Dhanmondi</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Budget</InputLabel>
            <Select label="Budget" value={design} onChange={handleChange(setDesign)}>
              <MenuItem value=""><em>$195000 - $390000</em></MenuItem>
              <MenuItem value={10}>$100000 - $200000</MenuItem>
              <MenuItem value={20}>$200000 - $500000</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Button variant="contained" color="primary" fullWidth sx={{ height: '56px' }} startIcon={<SearchIcon />}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
