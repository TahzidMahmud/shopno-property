import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Button, Menu, MenuItem, CircularProgress, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import { headerService } from '../services/headerFooterService';
import { HeaderNavigationLink } from '../types/HeaderFooter';

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [navigationLinks, setNavigationLinks] = useState<HeaderNavigationLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeaderData();
  }, []);

  const loadHeaderData = async () => {
    try {
      const data = await headerService.getAll();
      setSettings(data.settings || {});
      setNavigationLinks(data.navigation_links || []);
    } catch (error) {
      console.error('Error loading header data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '/assets/shopno-logo.png';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const logoUrl = getImageUrl(settings.logo);
  const listPropertyText = settings.list_property_button_text || 'List Property';
  const loginText = settings.login_button_text || 'Log In';

  const regularLinks = navigationLinks.filter(link => link.type === 'link' && link.is_active).sort((a, b) => a.order - b.order);
  const dropdownLink = navigationLinks.find(link => link.type === 'dropdown' && link.is_active);

  if (loading) {
    return (
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <CircularProgress size={24} color="inherit" />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', px: { xs: 1, sm: 2, md: 3 }, flexWrap: 'wrap', gap: 1 }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: { xs: '0 0 auto', sm: '0 0 auto' } }}>
            <img src={logoUrl} alt="Shopno Property Logo" style={{ height: 40 }} />
            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              SHOPNO <Box component="span" sx={{ display: 'block', fontSize: '0.8em', fontWeight: 400 }}>PROPERTY</Box>
            </Typography>
          </Box>

          {/* Navigation Links - Always visible on desktop, hidden on mobile */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: { md: 2, lg: 3, xl: 4 },
            flex: { md: '1 1 auto' },
            justifyContent: 'center',
            mx: { md: 1, lg: 2 }
          }}>
            {regularLinks.length > 0 ? (
              <>
                {regularLinks.map((link) => (
                  <Link
                    key={link.id}
                    to={link.url}
                    style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem', whiteSpace: 'nowrap' }}
                  >
                    {link.label}
                  </Link>
                ))}
                {dropdownLink && dropdownLink.dropdown_items && dropdownLink.dropdown_items.length > 0 && (
                  <>
                    <Button
                      color="inherit"
                      onClick={handleMenuOpen}
                      endIcon={<KeyboardArrowDownIcon />}
                      sx={{ textTransform: 'none', fontSize: '1rem', whiteSpace: 'nowrap' }}
                    >
                      {dropdownLink.label}
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      MenuListProps={{
                        'aria-labelledby': 'pages-button',
                      }}
                    >
                      {dropdownLink.dropdown_items
                        .filter(item => item.is_active)
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                          <MenuItem
                            key={item.id}
                            onClick={handleMenuClose}
                            component={Link}
                            to={item.url}
                          >
                            {item.label}
                          </MenuItem>
                        ))}
                    </Menu>
                  </>
                )}
              </>
            ) : (
              // Fallback navigation links if none are configured
              <>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                  Home
                </Link>
                <Link to="/projects" style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                  Projects
                </Link>
                <Link to="/about" style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                  About
                </Link>
                <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                  Contact
                </Link>
              </>
            )}
          </Box>

          {/* Desktop Buttons */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2, flex: { xs: '0 0 auto', sm: '0 0 auto' } }}>
            <Button variant="outlined" color="primary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>{listPropertyText}</Button>
            <Button variant="contained" color="primary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>{loginText}</Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleMobileMenuOpen}
            sx={{ display: { xs: 'block', md: 'none' }, flex: { xs: '0 0 auto' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <Box sx={{ width: 280, pt: 2 }}>
          <List>
            {regularLinks.map((link) => (
              <ListItem
                key={link.id}
                component={Link}
                to={link.url}
                onClick={handleMobileMenuClose}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            {dropdownLink && dropdownLink.dropdown_items && dropdownLink.dropdown_items.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                  <ListItemText primary={dropdownLink.label} sx={{ fontWeight: 'bold' }} />
                </ListItem>
                {dropdownLink.dropdown_items
                  .filter(item => item.is_active)
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <ListItem
                      key={item.id}
                      component={Link}
                      to={item.url}
                      onClick={handleMobileMenuClose}
                      sx={{ textDecoration: 'none', color: 'inherit', pl: 4 }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
              </>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="outlined" color="primary" fullWidth onClick={handleMobileMenuClose}>
                {listPropertyText}
              </Button>
              <Button variant="contained" color="primary" fullWidth onClick={handleMobileMenuClose}>
                {loginText}
              </Button>
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
