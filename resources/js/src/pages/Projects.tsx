import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, Grid, Button, MenuItem, Select, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types/Property';
import { propertyService } from '../services/propertyService';
import { propertyTypeService } from '../services/propertyTypeService';
import { projectsPageService } from '../services/projectsPageService';

const ITEMS_PER_PAGE = 9; // 3 columns x 3 rows

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [pageSettings, setPageSettings] = useState<Record<string, string>>({});

  // Filter states - initialize from URL params
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || '');
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get('type') || '');
  const [locationFilter, setLocationFilter] = useState<string>(searchParams.get('location') || '');
  const [budgetFilter, setBudgetFilter] = useState<string>(searchParams.get('budget') || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [propertiesData, typesData, settingsData] = await Promise.all([
          propertyService.getAll(),
          propertyTypeService.getActive(),
          projectsPageService.getAll()
        ]);
        setAllProperties(propertiesData);
        setFilteredProperties(propertiesData);
        setPropertyTypes(typesData);
        setPageSettings(settingsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique filter options from properties
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
        stepSize = 5000000; // 250K steps for very large ranges
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

  // Helper function to apply filters with specific parameters
  const applyFiltersWithParams = React.useCallback((status: string, type: string, location: string, budget: string, budgets: Array<{ label: string; value: string; min?: number; max?: number }>) => {
    let filtered = [...allProperties];

    if (status) {
      filtered = filtered.filter(p =>
        p.status?.toLowerCase() === status.toLowerCase() ||
        (status === 'Under Construction' && p.under_development?.toLowerCase().includes('yes'))
      );
    }

    if (type) {
      filtered = filtered.filter(p =>
        p.type?.toLowerCase().includes(type.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(p =>
        p.location?.toLowerCase().includes(location.toLowerCase()) ||
        p.full_address?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (budget && budgets.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.price) return false;
        const price = typeof p.price === 'number' ? p.price : parseFloat(String(p.price));

        const budgetOption = budgets.find(b => b.value === budget);
        if (!budgetOption) return false;

        // Handle "Above" ranges with Infinity max
        if (budgetOption.max === Infinity && budgetOption.min !== undefined) {
          return price >= budgetOption.min;
        }

        // Handle regular ranges (inclusive on both ends)
        if (budgetOption.min !== undefined && budgetOption.max !== undefined) {
          return price >= budgetOption.min && price <= budgetOption.max;
        }

        return false;
      });
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allProperties]);

  // Apply filters when URL params change or filters are set
  useEffect(() => {
    if (allProperties.length > 0) {
      // Update filter states from URL params
      const statusParam = searchParams.get('status') || '';
      const typeParam = searchParams.get('type') || '';
      const locationParam = searchParams.get('location') || '';
      const budgetParam = searchParams.get('budget') || '';

      setStatusFilter(statusParam);
      setTypeFilter(typeParam);
      setLocationFilter(locationParam);
      setBudgetFilter(budgetParam);

      // Apply filters if any are set
      if (statusParam || typeParam || locationParam || budgetParam) {
        // Only apply budget filter if availableBudgets is ready and budget param exists
        if (budgetParam && availableBudgets.length === 0) {
          // If budget is in URL but budgets aren't ready yet, just show all for now
          setFilteredProperties(allProperties);
        } else {
          applyFiltersWithParams(statusParam, typeParam, locationParam, budgetParam, availableBudgets);
        }
      } else {
        // If no params, show all properties
        setFilteredProperties(allProperties);
      }
    }
  }, [searchParams, allProperties, availableBudgets, applyFiltersWithParams]);

  // Filter properties based on selected filters
  const applyFilters = () => {
    applyFiltersWithParams(statusFilter, typeFilter, locationFilter, budgetFilter, availableBudgets);
  };

  const handleSearch = () => {
    // Update URL params when search is clicked
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (typeFilter) params.set('type', typeFilter);
    if (locationFilter) params.set('location', locationFilter);
    if (budgetFilter) params.set('budget', budgetFilter);

    setSearchParams(params);
    applyFilters();
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    setLocationFilter('');
    setBudgetFilter('');
    setFilteredProperties(allProperties);
    setCurrentPage(1);
    // Clear URL params
    setSearchParams({});
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

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '/assets/house1.jpg';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const heroBackground = getImageUrl(pageSettings.hero_background_image);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: { xs: '300px', sm: '400px', md: '500px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 0,
          },
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            position: 'relative',
            zIndex: 1,
            color: 'white',
          }}
        >
          Projects
        </Typography>
      </Box>

      {/* Search Filters */}
      <Container sx={{ my: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'white',
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, md: 2 },
            alignItems: 'center',
            justifyContent: { xs: 'flex-start', md: 'space-around' },
          }}
        >
          <FormControl sx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
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

          <FormControl sx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <InputLabel>Project Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Project Type"
            >
              <MenuItem value="">All</MenuItem>
              {availableTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              label="Location"
            >
              <MenuItem value="">All</MenuItem>
              {availableLocations.map(loc => (
                <MenuItem key={loc} value={loc}>{loc}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <InputLabel>Budget</InputLabel>
            <Select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              label="Budget"
            >
              <MenuItem value="">All</MenuItem>
              {availableBudgets.map(budgetOption => (
                <MenuItem key={budgetOption.value} value={budgetOption.value}>
                  {budgetOption.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            sx={{
              height: { xs: '48px', md: '56px' },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              minWidth: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
          {(statusFilter || typeFilter || locationFilter || budgetFilter) && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                height: { xs: '48px', md: '56px' },
                flex: { xs: '1 1 100%', sm: '0 0 auto' },
                minWidth: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          )}
        </Box>
      </Container>

      {/* Project List */}
      <Container sx={{ my: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : filteredProperties.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, md: 8 } }}>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
              No properties found
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {paginatedProperties.map((property: Property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <PropertyCard property={property} onOpen={handlePropertyClick} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: { xs: 0.5, md: 0 } }}>
                {pageNumbers.map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'contained' : 'outlined'}
                    onClick={() => handlePageChange(page)}
                    sx={{
                      mx: { xs: 0.25, md: 0.5 },
                      minWidth: { xs: 36, md: 40 },
                      height: { xs: 36, md: 40 },
                      fontSize: { xs: '0.85rem', md: '1rem' }
                    }}
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
