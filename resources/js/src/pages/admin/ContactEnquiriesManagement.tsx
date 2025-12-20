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
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { contactEnquiryService, ContactEnquiry } from '../../services/contactEnquiryService';

// Format date helper
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const ContactEnquiriesManagement: React.FC = () => {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const data = await contactEnquiryService.getAll();
      setEnquiries(data);
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to load contact enquiries',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (enquiry: ContactEnquiry) => {
    setSelectedEnquiry(enquiry);
    setViewDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contact enquiry?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await contactEnquiryService.delete(id);
      setEnquiries(enquiries.filter(e => e.id !== id));
      setNotification({
        open: true,
        message: 'Contact enquiry deleted successfully',
        severity: 'success',
      });
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to delete contact enquiry',
        severity: 'error',
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Contact Enquiries Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage contact enquiries submitted by visitors
      </Typography>

      {enquiries.length === 0 ? (
        <Alert severity="info">No contact enquiries found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Submitted At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell>{enquiry.id}</TableCell>
                  <TableCell>{enquiry.full_name}</TableCell>
                  <TableCell>{enquiry.phone_number}</TableCell>
                  <TableCell>{enquiry.email}</TableCell>
                  <TableCell>
                    {enquiry.project ? (
                      <Chip
                        label={enquiry.project}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>{formatDate(enquiry.created_at)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleView(enquiry)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(enquiry.id!)}
                      color="error"
                      disabled={deleteLoading === enquiry.id}
                    >
                      {deleteLoading === enquiry.id ? <CircularProgress size={20} /> : <DeleteIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Contact Enquiry Details</DialogTitle>
        <DialogContent>
          {selectedEnquiry && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                <Typography variant="body1">{selectedEnquiry.full_name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                <Typography variant="body1">{selectedEnquiry.phone_number}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{selectedEnquiry.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Project</Typography>
                <Typography variant="body1">{selectedEnquiry.project || 'N/A'}</Typography>
              </Box>
              {selectedEnquiry.message && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedEnquiry.message}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Submitted At</Typography>
                <Typography variant="body1">{formatDate(selectedEnquiry.created_at)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactEnquiriesManagement;

