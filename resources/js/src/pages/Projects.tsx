import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Button, MenuItem, Select, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types/Property';
import { propertyService } from '../services/propertyService';

const ITEMS_PER_PAGE = 9; // 3 columns x 3 rows

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [budgetFilter, setBudgetFilter] = useState<string>('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getAll();
        setAllProperties(data);
        setFilteredProperties(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Get unique filter options from properties
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

  // Filter properties based on selected filters
  const applyFilters = () => {
    let filtered = [...allProperties];

    if (statusFilter) {
      filtered = filtered.filter(p =>
        p.status?.toLowerCase() === statusFilter.toLowerCase() ||
        (statusFilter === 'Under Construction' && p.under_development?.toLowerCase().includes('yes'))
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(p =>
        p.type?.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(p =>
        p.location?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        p.full_address?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (budgetFilter) {
      filtered = filtered.filter(p => {
        if (!p.price_range) return false;
        const priceStr = p.price_range.replace(/[^0-9]/g, '');
        const price = parseInt(priceStr);

        if (budgetFilter === 'lessThan100k') {
          return price < 100000;
        } else if (budgetFilter === 'greaterThan500k') {
          return price > 500000;
        } else if (budgetFilter === '$195000 - $390000') {
          return price >= 195000 && price <= 390000;
        }
        return true;
      });
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    applyFilters();
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    setLocationFilter('');
    setBudgetFilter('');
    setFilteredProperties(allProperties);
    setCurrentPage(1);
  };

  const handlePropertyClick = (id: number) => {
    navigate(`/property-details/${id}`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProperties = useMemo(() => {
    return filteredProperties.slice(startIndex, endIndex);
  }, [filteredProperties, startIndex, endIndex]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset to page 1 when filtered properties change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProperties.length]);

  // Generate page numbers array (max 10 pages shown, matching original design)
  const pageNumbers = useMemo(() => {
    const maxPagesToShow = 10;
    const pages: number[] = [];
    const startPage = Math.max(1, Math.min(currentPage - 4, totalPages - maxPagesToShow + 1));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'url(/assets/house1.jpg)', // Placeholder image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
          Projects
        </Typography>
      </Box>

      {/* Search Filters */}
      <Container sx={{ my: 4 }}>
        <Box
          sx={{
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'white',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Project Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Project Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Under Construction">Under Construction</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              {availableStatuses.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Project Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Project Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Villa">Villa</MenuItem>
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="Penthouse">Penthouse</MenuItem>
              {availableTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              label="Location"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Gulshan">Gulshan</MenuItem>
              <MenuItem value="Dhanmondi">Dhanmondi</MenuItem>
              <MenuItem value="Bashundhara">Bashundhara</MenuItem>
              {availableLocations.map(location => (
                <MenuItem key={location} value={location}>{location}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Budget</InputLabel>
            <Select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              label="Budget"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="$195000 - $390000">$195000 - $390000</MenuItem>
              <MenuItem value="lessThan100k">Less than $100000</MenuItem>
              <MenuItem value="greaterThan500k">Greater than $500000</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            sx={{ height: '56px' }}
            onClick={handleSearch}
          >
            Search
          </Button>
          {(statusFilter || typeFilter || locationFilter || budgetFilter) && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{ height: '56px' }}
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          )}
        </Box>
      </Container>

      {/* Project List */}
      <Container sx={{ my: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : filteredProperties.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No properties found
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedProperties.map((property: Property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <PropertyCard property={property} onOpen={handlePropertyClick} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                {pageNumbers.map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'contained' : 'outlined'}
                    onClick={() => handlePageChange(page)}
                    sx={{ mx: 0.5 }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            )}
          </>
        )}
      </Container>

    </Box>
  );
};

export default Projects;
