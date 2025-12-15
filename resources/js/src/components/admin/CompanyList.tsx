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
  Avatar,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Company } from '../../services/companyService';

interface CompanyListProps {
  companies: Company[];
  loading?: boolean;
  onEdit: (company: Company) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  loading = false,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    company: Company | null;
  }>({ open: false, company: null });

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const handleDeleteClick = (company: Company) => {
    setDeleteDialog({ open: true, company });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.company?.id) {
      onDelete(deleteDialog.company.id);
      setDeleteDialog({ open: false, company: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, company: null });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Companies Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ textTransform: 'none' }}
        >
          Add Company
        </Button>
      </Box>

      {companies.length === 0 && !loading ? (
        <Alert severity="info">No companies found. Click "Add Company" to create one.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Logo</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Owner Name</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id} hover>
                  <TableCell>
                    <Avatar
                      src={getImageUrl(company.logo) || undefined}
                      alt={company.name}
                      sx={{ width: 56, height: 56 }}
                    >
                      {company.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.owner_name}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(company)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(company)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.company?.name}"? This action cannot be undone.
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

export default CompanyList;

