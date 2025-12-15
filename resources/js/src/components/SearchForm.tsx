import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { propertyService } from '../services/propertyService';
import { propertyTypeService } from '../services/propertyTypeService';
import { Property } from '../types/Property';

export default function SearchForm() {
  const navigate = useNavigate();
  const [projectStatus, setProjectStatus] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(true);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [propertiesData, typesData] = await Promise.all([
        propertyService.getAll(),
        propertyTypeService.getActive()
      ]);
      setAllProperties(propertiesData);
      setPropertyTypes(typesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique filter options from properties (matching Projects page)
  const availableStatuses = useMemo(() => {
    const statuses = Array.from(new Set(allProperties.map(p => p.status).filter(Boolean)));
    return statuses as string[];
  }, [allProperties]);

  // Use property types from database (active ones)
  const availableTypes = useMemo(() => {
    return propertyTypes.map(pt => ({
      label: pt.name,
      value: pt.type_value
    }));
  }, [propertyTypes]);

  const availableLocations = useMemo(() => {
    const locations = Array.from(new Set(allProperties.map(p => p.location).filter(Boolean)));
    return locations as string[];
  }, [allProperties]);

  // Generate budget ranges from property prices
  const availableBudgets = useMemo(() => {
    // Extract and convert prices, handling both number and string types
    const prices = allProperties
      .map(p => {
        const price = p.price;
        if (typeof price === 'number' && !isNaN(price)) {
          return price;
        }
        if (price !== null && price !== undefined) {
          const priceStr = String(price);
          const cleaned = priceStr.replace(/[^0-9.-]/g, ''); // Remove currency symbols
          const parsed = parseFloat(cleaned);
          return isNaN(parsed) ? null : parsed;
        }
        return null;
      })
      .filter((price): price is number => price !== null && price > 0)
      .sort((a, b) => a - b);

    if (prices.length === 0) {
      return [];
    }

    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];
    const priceRange = maxPrice - minPrice;

    // Determine the step size based on price range
    let stepSize: number;
    if (priceRange <= 50000) {
      stepSize = 10000; // 10K steps for small ranges
    } else if (priceRange <= 200000) {
      stepSize = 50000; // 50K steps for medium ranges
    } else if (priceRange <= 500000) {
      stepSize = 100000; // 100K steps for larger ranges
    } else {
      stepSize = 250000; // 250K steps for very large ranges
    }

    // Round down minPrice to nearest step
    const startPrice = Math.floor(minPrice / stepSize) * stepSize;
    // Round up maxPrice to nearest step
    const endPrice = Math.ceil(maxPrice / stepSize) * stepSize;

    const budgets: Array<{ label: string; value: string; min: number; max: number }> = [];

    // Create ranges in steps
    for (let current = startPrice; current < endPrice; current += stepSize) {
      const rangeMin = current;
      const rangeMax = current + stepSize;

      budgets.push({
        label: `৳${(rangeMin / 1000).toFixed(0)}K - ৳${(rangeMax / 1000).toFixed(0)}K`,
        value: `${rangeMin}_${rangeMax}`,
        min: rangeMin,
        max: rangeMax
      });
    }

    // Ensure all properties are covered by at least one range
    // Add an "Above" option if maxPrice is at the edge
    if (maxPrice >= endPrice - stepSize) {
      budgets.push({
        label: `Above ৳${((endPrice - stepSize) / 1000).toFixed(0)}K`,
        value: `above_${endPrice - stepSize}`,
        min: endPrice - stepSize,
        max: Infinity
      });
    }

    return budgets;
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
              {availableTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Location</InputLabel>
            <Select label="Location" value={location} onChange={handleChange(setLocation)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {availableLocations.map(loc => (
                <MenuItem key={loc} value={loc}>{loc}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Budget</InputLabel>
            <Select label="Budget" value={budget} onChange={handleChange(setBudget)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {availableBudgets.map(budgetOption => (
                <MenuItem key={budgetOption.value} value={budgetOption.value}>
                  {budgetOption.label}
                </MenuItem>
              ))}
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
