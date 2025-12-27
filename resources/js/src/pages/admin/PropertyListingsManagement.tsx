import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Grid,
  Card,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import {
  propertyListingService,
  PropertyListing,
} from '../../services/propertyListingService';

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const PropertyListingsManagement: React.FC = () => {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [statusLoading, setStatusLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await propertyListingService.getAll();
      setListings(data);
    } catch (error) {
      showNotification('Failed to load property listings', 'error');
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleView = (listing: PropertyListing) => {
    setSelectedListing(listing);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedListing(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await propertyListingService.delete(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      showNotification('Listing deleted successfully');
    } catch (error) {
      showNotification('Failed to delete listing', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleStatusChange = async (id: number, status: 'pending' | 'approved' | 'rejected') => {
    setStatusLoading(id);
    try {
      await propertyListingService.updateStatus(id, status);
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l))
      );
      showNotification('Listing status updated successfully');
    } catch (error) {
      showNotification('Failed to update listing status', 'error');
    } finally {
      setStatusLoading(null);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading && listings.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Property Listings Management
      </Typography>

      {listings.length === 0 ? (
        <Alert severity="info">No property listings found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Property Name</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Submitted At</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id} hover>
                  <TableCell>{listing.id}</TableCell>
                  <TableCell>{listing.property_name}</TableCell>
                  <TableCell>{listing.property_type || 'N/A'}</TableCell>
                  <TableCell>{listing.location}</TableCell>
                  <TableCell>
                    {listing.price ? `৳${listing.price.toLocaleString()}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={listing.status || 'pending'}
                      color={getStatusColor(listing.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(listing.created_at)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(listing)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {listing.status !== 'approved' && (
                        <IconButton
                          size="small"
                          onClick={() => handleStatusChange(listing.id!, 'approved')}
                          color="success"
                          disabled={statusLoading === listing.id}
                        >
                          {statusLoading === listing.id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <CheckCircleIcon />
                          )}
                        </IconButton>
                      )}
                      {listing.status !== 'rejected' && (
                        <IconButton
                          size="small"
                          onClick={() => handleStatusChange(listing.id!, 'rejected')}
                          color="error"
                          disabled={statusLoading === listing.id}
                        >
                          {statusLoading === listing.id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <CancelIcon />
                          )}
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(listing.id!)}
                        color="error"
                        disabled={deleteLoading === listing.id}
                      >
                        {deleteLoading === listing.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Property Listing Details</DialogTitle>
        <DialogContent>
          {selectedListing && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Property Name
                </Typography>
                <Typography variant="body1">{selectedListing.property_name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Property Type
                </Typography>
                <Typography variant="body1">{selectedListing.property_type || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Property Status
                </Typography>
                <Typography variant="body1">{selectedListing.property_status || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Listing Status
                </Typography>
                <Chip
                  label={selectedListing.status || 'pending'}
                  color={getStatusColor(selectedListing.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">{selectedListing.location}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Size
                </Typography>
                <Typography variant="body1">{selectedListing.size || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Price
                </Typography>
                <Typography variant="body1">
                  {selectedListing.price ? `৳${selectedListing.price.toLocaleString()}` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Handover Date
                </Typography>
                <Typography variant="body1">
                  {selectedListing.handover_date
                    ? formatDate(selectedListing.handover_date)
                    : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Submitted By
                </Typography>
                <Typography variant="body1">
                  {selectedListing.user_id ? `User ID: ${selectedListing.user_id}` : 'Guest'}
                </Typography>
              </Grid>
              {selectedListing.images && selectedListing.images.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Images
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedListing.images.map((image, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="200"
                            image={`/storage/${image}`}
                            alt={`Property image ${index + 1}`}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
              {selectedListing.brochure && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Brochure
                  </Typography>
                  <Button
                    variant="outlined"
                    href={`/storage/${selectedListing.brochure}`}
                    target="_blank"
                  >
                    Download Brochure
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PropertyListingsManagement;

