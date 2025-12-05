import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Card,
  CardMedia,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Facility } from '../../types/Facility';

interface FacilityDetailsProps {
  facility: Facility;
  onEdit: () => void;
  onBack: () => void;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({
  facility,
  onEdit,
  onBack,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            Facility Details
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
        >
          Edit Facility
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Information */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <BusinessIcon color="primary" />
              <Typography variant="h5" component="h2">
                {facility.title}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Created Date
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(facility.created_at)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(facility.updated_at)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Facility ID
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  #{facility.id}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Additional Information */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Facility Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body1" color="text.secondary" paragraph>
              This facility is available for residents and can be used according to the property guidelines.
              For more information about usage rules and availability, please contact the property management.
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Status: <strong>Active</strong>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Facility Image */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Facility Image
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {facility.image ? (
              <Card>
                <CardMedia
                  component="img"
                  height="250"
                  image={`/storage/${facility.image}`}
                  alt={facility.title}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            ) : (
              <Box
                sx={{
                  height: 250,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  border: '2px dashed',
                  borderColor: 'grey.300',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No image available
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Quick Actions */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEdit}
                fullWidth
              >
                Edit Facility
              </Button>

              <Button
                variant="outlined"
                onClick={onBack}
                fullWidth
              >
                Back to List
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FacilityDetails;
