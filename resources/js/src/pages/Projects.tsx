import React from 'react';
import { Box, Container, Typography, Grid, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import mockProperties from '../data/mockProperties';
import { Property } from '../types'; // Import Property type

const Projects: React.FC = () => {
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
            <Select defaultValue="Under Construction">
              <MenuItem value="Under Construction">Under Construction</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Project Type</InputLabel>
            <Select defaultValue="Villa">
              <MenuItem value="Villa">Villa</MenuItem>
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="Penthouse">Penthouse</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Location</InputLabel>
            <Select defaultValue="Gulshan">
              <MenuItem value="Gulshan">Gulshan</MenuItem>
              <MenuItem value="Dhanmondi">Dhanmondi</MenuItem>
              <MenuItem value="Bashundhara">Bashundhara</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Budget</InputLabel>
            <Select defaultValue="$195000 - $390000">
              <MenuItem value="$195000 - $390000">$195000 - $390000</MenuItem>
              <MenuItem value="lessThan100k">Less than $100000</MenuItem>
              <MenuItem value="greaterThan500k">Greater than $500000</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" sx={{ height: '56px' }}>
            Search
          </Button>
        </Box>
      </Container>

      {/* Project List */}
      <Container sx={{ my: 4 }}>
        <Grid container spacing={3}>
          {mockProperties.map((property: Property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <PropertyCard property={property} onOpen={(id) => console.log('Open property:', id)} />
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? 'contained' : 'outlined'}
              sx={{ mx: 0.5 }}
            >
              {page}
            </Button>
          ))}
        </Box>
      </Container>

    </Box>
  );
};

export default Projects;
