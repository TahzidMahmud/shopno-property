import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import CompanyList from '../../components/admin/CompanyList';
import CompanyForm from '../../components/admin/CompanyForm';
import { Company, CompanyFormData } from '../../services/companyService';
import { companyService } from '../../services/companyService';

type ViewMode = 'list' | 'form';

const CompaniesManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await companyService.getAll();
      setCompanies(data || []);
    } catch (error: any) {
      console.error('Error loading companies:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load companies';
      showNotification(errorMessage, 'error');
      setCompanies([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleAdd = () => {
    setSelectedCompany(null);
    setViewMode('form');
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setViewMode('form');
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await companyService.delete(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
      showNotification('Company deleted successfully');
    } catch (error: any) {
      showNotification('Failed to delete company', 'error');
      console.error('Error deleting company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: CompanyFormData) => {
    setSubmitLoading(true);
    try {
      if (selectedCompany) {
        const updatedCompany = await companyService.update(selectedCompany.id!, data);
        setCompanies(prev =>
          prev.map(c => c.id === selectedCompany.id ? updatedCompany : c)
        );
        showNotification('Company updated successfully');
      } else {
        const newCompany = await companyService.create(data);
        setCompanies(prev => [...prev, newCompany]);
        showNotification('Company created successfully');
      }
      setViewMode('list');
      setSelectedCompany(null);
    } catch (error: any) {
      showNotification(
        selectedCompany ? 'Failed to update company' : 'Failed to create company',
        'error'
      );
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedCompany(null);
  };

  return (
    <Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && viewMode === 'list'}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box>
        {viewMode === 'list' && (
          <CompanyList
            companies={companies}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {viewMode === 'form' && (
          <CompanyForm
            company={selectedCompany || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={submitLoading}
          />
        )}
      </Box>

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

export default CompaniesManagement;

