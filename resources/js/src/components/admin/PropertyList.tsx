import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Property } from '../../types/Property';

interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
  onView: (property: Property) => void;
  onAdd: () => void;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onAdd,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    property: Property | null;
  }>({ open: false, property: null });

  // Filter properties based on search term
  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered properties
  const paginatedProperties = filteredProperties.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (property: Property) => {
    setDeleteDialog({ open: true, property });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.property) {
      onDelete(deleteDialog.property.id!);
      setDeleteDialog({ open: false, property: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, property: null });
  };

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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Properties Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Add New Property
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search properties by title, location, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price Range</TableCell>
              <TableCell>Bedrooms</TableCell>
              <TableCell>Bathrooms</TableCell>
              <TableCell>Company</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  {searchTerm ? 'No properties found matching your search.' : 'No properties found.'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedProperties.map((property) => (
                <TableRow key={property.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
                      {property.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={property.status || 'N/A'}
                      color={getStatusColor(property.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{property.type || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                      {property.location || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{property.price ? `৳ ${property.price.toLocaleString()}` : 'N/A'}</TableCell>
                  <TableCell>{property.bedrooms || 'N/A'}</TableCell>
                  <TableCell>{property.bathrooms || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                      {property.company?.name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/property-details/${property.id}`)}
                        title="View Details"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(property)}
                        title="Edit Property"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(property)}
                        title="Delete Property"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredProperties.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the property "{deleteDialog.property?.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyList;
