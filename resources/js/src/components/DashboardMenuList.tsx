import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Pool as PoolIcon,
  Web as WebIcon,
  Menu as MenuIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

interface DashboardMenuListProps {
  open: boolean;
  handleDrawerClose: () => void;
  theme: Theme;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  permission?: string | string[]; // Single permission or array of permissions (any of them)
  requireAll?: boolean; // If true, requires all permissions; if false, requires any permission
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' }, // No permission required - accessible to all authenticated users
  { text: 'Properties', icon: <HomeIcon />, path: '/admin/dashboard/properties', permission: ['properties.manage', 'properties.create', 'properties.edit', 'properties.delete'] },
  { text: 'Facilities', icon: <PoolIcon />, path: '/admin/dashboard/facilities', permission: 'facilities.manage' },
  { text: 'Home Page Management', icon: <WebIcon />, path: '/admin/dashboard/homepage', permission: 'pages.manage' },
  { text: 'Header & Footer', icon: <MenuIcon />, path: '/admin/dashboard/header-footer', permission: 'pages.manage' },
  { text: 'Contact Page', icon: <WebIcon />, path: '/admin/dashboard/contact-page', permission: 'pages.manage' },
  { text: 'About Page', icon: <WebIcon />, path: '/admin/dashboard/about-page', permission: 'pages.manage' },
  { text: 'Projects Page', icon: <WebIcon />, path: '/admin/dashboard/projects-page', permission: 'pages.manage' },
  { text: 'Partner Submissions', icon: <AssignmentIcon />, path: '/admin/dashboard/partner-submissions', permission: 'submissions.view' },
  { text: 'Property Queries', icon: <AssignmentIcon />, path: '/admin/dashboard/property-queries', permission: 'queries.view' },
  { text: 'Contact Enquiries', icon: <AssignmentIcon />, path: '/admin/dashboard/contact-enquiries', permission: 'enquiries.view' },
  { text: 'Property Listings', icon: <AssignmentIcon />, path: '/admin/dashboard/property-listings', permission: 'listings.manage' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/dashboard/users', permission: 'users.manage' },
  { text: 'Roles', icon: <SecurityIcon />, path: '/admin/dashboard/roles', permission: 'roles.manage' },
  { text: 'Companies', icon: <BusinessIcon />, path: '/admin/dashboard/companies', permission: 'companies.manage' },
  { text: 'Property Types', icon: <CategoryIcon />, path: '/admin/dashboard/property-types', permission: 'property-types.manage' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/dashboard/settings', permission: 'settings.manage' },
];

export default function DashboardMenuList({ open, handleDrawerClose, theme }: DashboardMenuListProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, user } = usePermissions();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  /**
   * Check if user has access to a menu item
   */
  const canAccessMenuItem = (item: MenuItem): boolean => {
    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Menu access check:', {
        item: item.text,
        user: user?.name,
        roles: user?.roles,
        permissions: user?.permissions,
        isAdmin: isAdmin(),
        hasPermission: item.permission,
      });
    }

    // If user data is not loaded yet, show only Dashboard
    if (!user) {
      return item.text === 'Dashboard';
    }

    // Admin has access to everything - check this FIRST
    // Also check if user has "Admin User" name or admin email as fallback (for existing users without role)
    const isAdminUser = isAdmin() || 
                        user.name?.toLowerCase().includes('admin') ||
                        user.email?.toLowerCase().includes('admin@shopnoproperty.com');
    if (isAdminUser) {
      return true;
    }

    // If no permission is required, allow access (e.g., Dashboard)
    if (!item.permission) {
      return true;
    }

    // Check permissions for non-admin users
    if (Array.isArray(item.permission)) {
      // If requireAll is true, user must have all permissions
      if (item.requireAll) {
        return hasAllPermissions(item.permission);
      }
      // Otherwise, user needs any of the permissions
      return hasAnyPermission(item.permission);
    } else {
      // Single permission check
      return hasPermission(item.permission);
    }
  };

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter(item => canAccessMenuItem(item));

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {visibleMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleMenuClick(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
}
