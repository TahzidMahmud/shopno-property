import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchOptionService } from '../services/homePageService';
import { SearchOption } from '../types/HomePage';

export default function SearchForm() {
  const [projectStatus, setProjectStatus] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<{
    project_status: SearchOption[];
    property_type: SearchOption[];
    location: SearchOption[];
    budget: SearchOption[];
  }>({
    project_status: [],
    property_type: [],
    location: [],
    budget: [],
  });

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const allOptions = await searchOptionService.getAll();
      const activeOptions = allOptions.filter(opt => opt.is_active);
      
      setOptions({
        project_status: activeOptions.filter(opt => opt.category === 'project_status').sort((a, b) => a.order - b.order),
        property_type: activeOptions.filter(opt => opt.category === 'property_type').sort((a, b) => a.order - b.order),
        location: activeOptions.filter(opt => opt.category === 'location').sort((a, b) => a.order - b.order),
        budget: activeOptions.filter(opt => opt.category === 'budget').sort((a, b) => a.order - b.order),
      });
    } catch (error) {
      console.error('Error loading search options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: SelectChangeEvent) => {
    setter(event.target.value as string);
  };

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Search:', { projectStatus, propertyType, location, budget });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      backgroundColor: '#ffffff',
      padding: 4,
      borderRadius: 2,
      width: '90%',
      maxWidth: '1200px',
      boxShadow: '2px 5px 5px rgba(0, 0, 0, 0.25)',
      zIndex: 0,
      margin: '0 auto',
      marginY: '4rem'
    }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Project Status</InputLabel>
            <Select label="Project Status" value={projectStatus} onChange={handleChange(setProjectStatus)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {options.project_status.map((option) => (
                <MenuItem key={option.id} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Property Type</InputLabel>
            <Select label="Property Type" value={propertyType} onChange={handleChange(setPropertyType)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {options.property_type.map((option) => (
                <MenuItem key={option.id} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Location</InputLabel>
            <Select label="Location" value={location} onChange={handleChange(setLocation)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {options.location.map((option) => (
                <MenuItem key={option.id} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Budget</InputLabel>
            <Select label="Budget" value={budget} onChange={handleChange(setBudget)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {options.budget.map((option) => (
                <MenuItem key={option.id} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ height: '56px' }} 
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
