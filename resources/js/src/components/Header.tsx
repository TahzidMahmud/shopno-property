import React, { useState, useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Button, Menu, MenuItem, CircularProgress, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import { headerService } from '../services/headerFooterService';
import { HeaderNavigationLink } from '../types/HeaderFooter';

export default function Header() {
  const location = useLocation();
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

  // Get current pathname to determine active link
  const isActiveLink = (url: string) => {
    if (url === '/' && location.pathname === '/') return true;
    if (url !== '/' && location.pathname.startsWith(url)) return true;
    return false;
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', bgcolor: 'white' }}>
        <Box sx={{ width: '100%', height: '4px', bgcolor: '#2c2c2c' }} />
        <Toolbar sx={{ justifyContent: 'center' }}>
          <CircularProgress size={24} sx={{ color: '#00bcd4' }} />
        </Toolbar>
      </Box>
    );
  }

  return (
    <>
      {/* Dark Grey Top Bar */}
      <Box sx={{ width: '100%', height: '4px', bgcolor: '#2c2c2c' }} />

      {/* Main Navigation Bar */}
      <Box sx={{
        width: '100%',
        bgcolor: 'white',
        boxShadow: 'none'
      }}>
        <Toolbar sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          py: 2,
          minHeight: '80px !important',
          maxWidth: '1400px',
          mx: 'auto'
        }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: { xs: '0 0 auto' } }}>
            <img src={logoUrl} alt="Shopno Property Logo" style={{ height: 45 }} />

          </Box>

          {/* Navigation Links - Always visible on desktop, hidden on mobile */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: { md: 3, lg: 4 },
            flex: { md: '1 1 auto' },
            justifyContent: 'center',
            mx: { md: 2, lg: 3 }
          }}>
            {regularLinks.length > 0 ? (
              <>
                {regularLinks.map((link) => {
                  const active = isActiveLink(link.url);
                  return (
                    <Link
                      key={link.id}
                      to={link.url}
                      style={{
                        textDecoration: 'none',
                        fontSize: '1rem',
                        whiteSpace: 'nowrap',
                        fontWeight: active ? 500 : 400,
                        color: active ? '#00bcd4' : '#666666', // Light blue for active, grey for inactive
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                {dropdownLink && dropdownLink.dropdown_items && dropdownLink.dropdown_items.length > 0 && (
                  <>
                    <Button
                      onClick={handleMenuOpen}
                      endIcon={<KeyboardArrowDownIcon sx={{ fontSize: '1rem' }} />}
                      sx={{
                        textTransform: 'none',
                        fontSize: '1rem',
                        whiteSpace: 'nowrap',
                        color: '#666666',
                        fontWeight: 400,
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: '#00bcd4'
                        }
                      }}
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
                <Link
                  to="/"
                  style={{
                    textDecoration: 'none',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    color: isActiveLink('/') ? '#00bcd4' : '#666666',
                    fontWeight: isActiveLink('/') ? 500 : 400
                  }}
                >
                  Home
                </Link>
                <Link
                  to="/projects"
                  style={{
                    textDecoration: 'none',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    color: isActiveLink('/projects') ? '#00bcd4' : '#666666',
                    fontWeight: isActiveLink('/projects') ? 500 : 400
                  }}
                >
                  Projects
                </Link>
                <Link
                  to="/about"
                  style={{
                    textDecoration: 'none',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    color: isActiveLink('/about') ? '#00bcd4' : '#666666',
                    fontWeight: isActiveLink('/about') ? 500 : 400
                  }}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  style={{
                    textDecoration: 'none',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    color: isActiveLink('/contact') ? '#00bcd4' : '#666666',
                    fontWeight: isActiveLink('/contact') ? 500 : 400
                  }}
                >
                  Contact
                </Link>
              </>
            )}
          </Box>

          {/* Desktop Buttons */}
          <Box sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 2,
            flex: { xs: '0 0 auto' }
          }}>
            <Button
              variant="outlined"
              sx={{
                fontSize: '1rem',
                textTransform: 'none',
                color: '#00bcd4',
                borderColor: '#00bcd4',
                bgcolor: 'white',
                px: 2.5,
                py: 1,
                borderRadius: 1,
                '&:hover': {
                  borderColor: '#00bcd4',
                  bgcolor: '#f0f9fa'
                }
              }}
            >
              {listPropertyText}
            </Button>
            <Button
              variant="contained"
              sx={{
                fontSize: '1rem',
                textTransform: 'none',
                bgcolor: '#00bcd4',
                color: 'white',
                px: 2.5,
                py: 1,
                borderRadius: 1,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#00acc1',
                  boxShadow: 'none'
                }
              }}
            >
              {loginText}
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="open drawer"
            edge="end"
            onClick={handleMobileMenuOpen}
            sx={{
              display: { xs: 'block', md: 'none' },
              flex: { xs: '0 0 auto' },
              color: '#666666'
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Box>

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
