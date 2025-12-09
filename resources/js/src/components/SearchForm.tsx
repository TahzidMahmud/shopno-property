import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/Property';

export default function SearchForm() {
  const navigate = useNavigate();
  const [projectStatus, setProjectStatus] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(true);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertyService.getAll();
      setAllProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique filter options from properties (matching Projects page)
  const availableStatuses = useMemo(() => {
    const statuses = Array.from(new Set(allProperties.map(p => p.status).filter(Boolean)));
    return statuses as string[];
  }, [allProperties]);

  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(allProperties.map(p => p.type).filter(Boolean)));
    return types as string[];
  }, [allProperties]);

  const availableLocations = useMemo(() => {
    const locations = Array.from(new Set(allProperties.map(p => p.location).filter(Boolean)));
    return locations as string[];
  }, [allProperties]);

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: SelectChangeEvent) => {
    setter(event.target.value as string);
  };

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (projectStatus) {
      params.append('status', projectStatus);
    }
    if (propertyType) {
      params.append('type', propertyType);
    }
    if (location) {
      params.append('location', location);
    }
    if (budget) {
      params.append('budget', budget);
    }
    
    // Navigate to projects page with query parameters
    const queryString = params.toString();
    navigate(`/projects${queryString ? `?${queryString}` : ''}`);
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
      padding: { xs: 2, sm: 2.5, md: 3 },
      borderRadius: 2,
      width: { xs: '95%', sm: '90%' },
      maxWidth: '1200px',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 0,
      margin: '0 auto',
      marginTop: { xs: '-2rem', md: '-3rem' },
      marginBottom: { xs: '2rem', md: '4rem' },
      position: 'relative'
    }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Project Status</InputLabel>
            <Select label="Project Status" value={projectStatus} onChange={handleChange(setProjectStatus)}>
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="Under Construction">Under Construction</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              {availableStatuses.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Property Type</InputLabel>
            <Select label="Property Type" value={propertyType} onChange={handleChange(setPropertyType)}>
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="Villa">Villa</MenuItem>
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="Penthouse">Penthouse</MenuItem>
              {availableTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Location</InputLabel>
            <Select label="Location" value={location} onChange={handleChange(setLocation)}>
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="Gulshan">Gulshan</MenuItem>
              <MenuItem value="Dhanmondi">Dhanmondi</MenuItem>
              <MenuItem value="Bashundhara">Bashundhara</MenuItem>
              {availableLocations.map(location => (
                <MenuItem key={location} value={location}>{location}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Budget</InputLabel>
            <Select label="Budget" value={budget} onChange={handleChange(setBudget)}>
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="$195000 - $390000">$195000 - $390000</MenuItem>
              <MenuItem value="lessThan100k">Less than $100000</MenuItem>
              <MenuItem value="greaterThan500k">Greater than $500000</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={2.4}>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ 
              height: { xs: '48px', md: '56px' },
              backgroundColor: '#00bcd4',
              color: 'white',
              textTransform: 'none',
              fontSize: { xs: '0.9rem', md: '1rem' },
              '&:hover': {
                backgroundColor: '#00acc1',
              }
            }} 
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
