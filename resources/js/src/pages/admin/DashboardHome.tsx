import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Properties', value: '0', icon: <HomeIcon />, color: '#1976d2' },
    { title: 'Active Users', value: '0', icon: <PeopleIcon />, color: '#388e3c' },
    { title: 'Companies', value: '0', icon: <BusinessIcon />, color: '#f57c00' },
    { title: 'Monthly Growth', value: '0%', icon: <TrendingUpIcon />, color: '#7b1fa2' },
  ];

  const quickActions = [
    {
      title: 'Manage Properties',
      description: 'Add, edit, and manage property listings',
      action: () => navigate('/admin/dashboard/properties'),
      color: '#1976d2',
    },
    {
      title: 'Manage Facilities',
      description: 'Add, edit, and manage property facilities',
      action: () => navigate('/admin/dashboard/facilities'),
      color: '#2e7d32',
    },
    {
      title: 'Home Page Management',
      description: 'Manage hero slides, features, blog posts, and more',
      action: () => navigate('/admin/dashboard/homepage'),
      color: '#9c27b0',
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      action: () => navigate('/admin/dashboard/users'),
      color: '#388e3c',
    },
    {
      title: 'Company Settings',
      description: 'Configure company profiles and settings',
      action: () => navigate('/admin/dashboard/companies'),
      color: '#f57c00',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to the Shopno Property Admin Dashboard. Manage your properties, users, and system settings from here.
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderLeft: `4px solid ${stat.color}`,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: action.color }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={action.action}
                  sx={{ color: action.color }}
                >
                  Go to {action.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardHome;
