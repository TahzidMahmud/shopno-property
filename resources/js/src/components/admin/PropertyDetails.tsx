import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Card,
  CardMedia,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { Property } from '../../types/Property';
import { getYouTubeEmbedUrl, extractYouTubeVideoId } from '../../utils/youtube';

interface PropertyDetailsProps {
  property: Property;
  onEdit: () => void;
  onBack: () => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  onEdit,
  onBack,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'sold':
        return 'error';
      case 'rented':
        return 'warning';
      case 'under_construction':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            variant="outlined"
          >
            Back to List
          </Button>
          <Typography variant="h4" component="h1">
            Property Details
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
        >
          Edit Property
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Information */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <HomeIcon color="primary" />
              <Typography variant="h5" component="h2">
                {property.title}
              </Typography>
              <Chip
                label={property.status || 'N/A'}
                color={getStatusColor(property.status) as any}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {property.type || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Area
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {property.area || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Location
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {property.location || 'N/A'}
                </Typography>
              </Grid>

              {property.full_address && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Full Address
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {property.full_address}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Company
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {property.company?.name || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Property Specifications */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Property Specifications
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Floors
                </Typography>
                <Typography variant="h6">
                  {property.total_floor || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Flats
                </Typography>
                <Typography variant="h6">
                  {property.total_flat || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Flat Size
                </Typography>
                <Typography variant="h6">
                  {property.flat_size ? `${property.flat_size} sq ft` : 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Bedrooms
                </Typography>
                <Typography variant="h6">
                  {property.bedrooms || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Bathrooms
                </Typography>
                <Typography variant="h6">
                  {property.bathrooms || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Parking Spaces
                </Typography>
                <Typography variant="h6">
                  {property.total_parking || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Key Transports */}
          {property.key_transports && property.key_transports.length > 0 && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Transportation
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {property.key_transports.map((transport, index) => (
                  <Chip key={index} label={transport} variant="outlined" />
                ))}
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Price & Status */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pricing & Status
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" color="text.secondary">
              Price Range
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              {property.price_range || 'Contact for Price'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Under Development
            </Typography>
            <Chip
              label={property.under_development === 'yes' ? 'Yes' : 'No'}
              color={property.under_development === 'yes' ? 'warning' : 'success'}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Created
            </Typography>
            <Typography variant="body1">
              {formatDate(property.created_at)}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Last Updated
            </Typography>
            <Typography variant="body1">
              {formatDate(property.updated_at)}
            </Typography>
          </Paper>

          {/* Main Image */}
          {property.main_image && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Main Image
              </Typography>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={`/storage/${property.main_image}`}
                  alt={property.title}
                />
              </Card>
            </Paper>
          )}

          {/* Demo Video */}
          {property.demo_video && extractYouTubeVideoId(property.demo_video) && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Demo Video (YouTube)
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  overflow: 'hidden',
                  borderRadius: 1,
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    border: 0,
                  }}
                  src={getYouTubeEmbedUrl(property.demo_video) || ''}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Property Demo Video"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {property.demo_video}
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Layout Images */}
        {property.layout_images && property.layout_images.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Layout Images
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ImageList cols={3} gap={8}>
                {property.layout_images.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={`/storage/${image}`}
                      alt={`Layout ${index + 1}`}
                      loading="lazy"
                      style={{ borderRadius: '4px' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          </Grid>
        )}

        {/* Gallery Images */}
        {property.gallery_images && property.gallery_images.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Gallery Images
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ImageList cols={4} gap={8}>
                {property.gallery_images.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={`/storage/${image}`}
                      alt={`Gallery ${index + 1}`}
                      loading="lazy"
                      style={{ borderRadius: '4px' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PropertyDetails;
