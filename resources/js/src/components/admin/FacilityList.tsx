import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { Facility } from '../../types/Facility';

interface FacilityListProps {
  facilities: Facility[];
  loading?: boolean;
  onEdit: (facility: Facility) => void;
  onDelete: (id: number) => void;
  onView: (facility: Facility) => void;
  onAdd: () => void;
}

const FacilityList: React.FC<FacilityListProps> = ({
  facilities,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onAdd,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    facility: Facility | null;
  }>({ open: false, facility: null });

  // Filter facilities based on search term
  const filteredFacilities = facilities.filter(facility =>
    facility.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered facilities
  const paginatedFacilities = filteredFacilities.slice(
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

  const handleDeleteClick = (facility: Facility) => {
    setDeleteDialog({ open: true, facility });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.facility) {
      onDelete(deleteDialog.facility.id!);
      setDeleteDialog({ open: false, facility: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, facility: null });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Facilities Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Add New Facility
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search facilities by title..."
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
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Updated Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedFacilities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {searchTerm ? 'No facilities found matching your search.' : 'No facilities found.'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedFacilities.map((facility) => (
                <TableRow key={facility.id} hover>
                  <TableCell>
                    {facility.image ? (
                      <Avatar
                        src={`/storage/${facility.image}`}
                        alt={facility.title}
                        sx={{ width: 50, height: 50 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 50, height: 50, bgcolor: 'grey.300' }}>
                        <ImageIcon />
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {facility.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(facility.created_at)}</TableCell>
                  <TableCell>{formatDate(facility.updated_at)}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => onView(facility)}
                        title="View Details"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(facility)}
                        title="Edit Facility"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(facility)}
                        title="Delete Facility"
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
        count={filteredFacilities.length}
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
            Are you sure you want to delete the facility "{deleteDialog.facility?.title}"?
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

export default FacilityList;
