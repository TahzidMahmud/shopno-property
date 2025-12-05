import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';

export default function Home() {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Shopno Property
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Property Management System
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AdminIcon />}
            onClick={handleAdminClick}
            sx={{ px: 4, py: 2 }}
          >
            Go to Admin Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
