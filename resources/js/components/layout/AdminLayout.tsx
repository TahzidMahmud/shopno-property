import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin Dashboard' }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleHomeClick}
            title="Go to Home"
          >
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50' }}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
