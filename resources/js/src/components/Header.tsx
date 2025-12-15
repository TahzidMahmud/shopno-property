import React, { useState, useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Button, Menu, MenuItem, CircularProgress, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import { headerService } from '../services/headerFooterService';
import { HeaderNavigationLink } from '../types/HeaderFooter';

// Figma Asset URLs (valid for 7 days)
const FIGMA_ASSETS = {
  logo: 'https://www.figma.com/api/mcp/asset/f1af6f70-cb82-4afe-bb66-c0e0c840f9ee',
  navLine: 'https://www.figma.com/api/mcp/asset/ea6bb0a2-7c80-455a-86c4-61bd7d84b06b',
  arrowDown: 'https://www.figma.com/api/mcp/asset/f0fcbc97-ce5a-48c1-a645-bda0752722a8',
  buttonLine: 'https://www.figma.com/api/mcp/asset/8941595d-3cd0-4911-981f-f6c6868f961f',
};

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
      <Box sx={{ width: '100%', bgcolor: 'white', borderBottom: '1px solid #e8e7e7' }}>
        <Toolbar sx={{ justifyContent: 'center', minHeight: '80px !important' }}>
          <CircularProgress size={24} sx={{ color: '#17badf' }} />
        </Toolbar>
      </Box>
    );
  }

  return (
    <>
      {/* Main Navigation Bar */}
      <Box sx={{
        width: '100%',
        bgcolor: 'white',
        borderBottom: '1px solid #e8e7e7',
        position: 'relative',
        height: '80px',
        maxWidth: '1440px',
        mx: 'auto'
      }}>
        {/* Logo Section - Positioned at left=120px, vertically centered */}
          {/* Logo Section */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              position: 'absolute',
              left: '10%',
              transform: 'translateX(-50%)',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <img src={logoUrl} alt="Shopno Property Logo" style={{ height: '4.5rem' }} />
          </Box>

        {/* Mobile Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '47.833px',
            width: '140px',
            overflow: 'hidden',
            display: { xs: 'block', md: 'none' },
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <Box
            component="img"
            src={logoUrl || FIGMA_ASSETS.logo}
            alt="Shopno Property Logo"
            sx={{
              height: '431.61%',
              width: '148.08%',
              position: 'absolute',
              left: '-24.62%',
              top: '-161.43%',
              maxWidth: 'none'
            }}
          />
        </Box>

        {/* Navigation Links - Centered horizontally and vertically */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: '40px',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          height: '40px'
        }}>
            {regularLinks.length > 0 ? (
              <>
                {regularLinks.map((link) => {
                  const active = isActiveLink(link.url);
                  return (
                    <Box
                      key={link.id}
                      component={Link}
                      to={link.url}
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        height: '40px',
                        paddingTop: '10px',
                        position: 'relative',
                        textDecoration: 'none',
                        alignItems: 'flex-start',
                        overflow: 'hidden'
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '18px',
                          lineHeight: 1.2,
                          fontWeight: active ? 600 : 400,
                          fontStyle: 'normal',
                          color: active ? '#66d1e9' : '#737373',
                          whiteSpace: 'nowrap',
                          fontVariationSettings: "'opsz' 14"
                        }}
                      >
                        {link.label}
                      </Typography>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '2px',
                          height: '1px',
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          component="img"
                          src={FIGMA_ASSETS.navLine}
                          alt=""
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            maxWidth: 'none'
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
                {dropdownLink && dropdownLink.dropdown_items && dropdownLink.dropdown_items.length > 0 && (
                  <>
                    <Box
                      onClick={handleMenuOpen}
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        height: '40px',
                        paddingTop: '10px',
                        position: 'relative',
                        cursor: 'pointer',
                        alignItems: 'flex-start',
                        overflow: 'hidden'
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '18px',
                          lineHeight: 1.2,
                          fontWeight: 400,
                          fontStyle: 'normal',
                          color: '#737373',
                          whiteSpace: 'nowrap',
                          fontVariationSettings: "'opsz' 14"
                        }}
                      >
                        {dropdownLink.label}
                      </Typography>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '2px',
                          height: '1px',
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          component="img"
                          src={FIGMA_ASSETS.navLine}
                          alt=""
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            maxWidth: 'none'
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: '18px',
                          height: '18px',
                          position: 'relative',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: '34.37% 17.71% 34.38% 17.71%'
                          }}
                        >
                          <Box
                            component="img"
                            src={FIGMA_ASSETS.arrowDown}
                            alt=""
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'block',
                              maxWidth: 'none'
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
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
                <Box
                  component={Link}
                  to="/"
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    height: '40px',
                    paddingTop: '10px',
                    position: 'relative',
                    textDecoration: 'none',
                    alignItems: 'flex-start',
                    overflow: 'hidden'
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '18px',
                      lineHeight: 1.2,
                      fontWeight: isActiveLink('/') ? 600 : 400,
                      fontStyle: 'normal',
                      color: isActiveLink('/') ? '#66d1e9' : '#737373',
                      whiteSpace: 'nowrap',
                      fontVariationSettings: "'opsz' 14"
                    }}
                  >
                    Home
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '2px',
                      height: '1px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      component="img"
                      src={FIGMA_ASSETS.navLine}
                      alt=""
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'block'
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  component={Link}
                  to="/about"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    height: '40px',
                    paddingTop: '10px',
                    position: 'relative',
                    textDecoration: 'none',
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '18px',
                      lineHeight: 1.2,
                      fontWeight: 400,
                      fontStyle: 'normal',
                      color: '#737373',
                      whiteSpace: 'nowrap',
                      fontVariationSettings: "'opsz' 14"
                    }}
                  >
                    About Us
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '2px',
                      height: '1px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      component="img"
                      src={FIGMA_ASSETS.navLine}
                      alt=""
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'block'
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  component={Link}
                  to="/projects"
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    height: '40px',
                    paddingTop: '10px',
                    position: 'relative',
                    textDecoration: 'none',
                    alignItems: 'flex-start',
                    overflow: 'hidden'
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '18px',
                      lineHeight: 1.2,
                      fontWeight: 400,
                      fontStyle: 'normal',
                      color: '#737373',
                      whiteSpace: 'nowrap',
                      fontVariationSettings: "'opsz' 14"
                    }}
                  >
                    Properties
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '2px',
                      height: '1px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      component="img"
                      src={FIGMA_ASSETS.navLine}
                      alt=""
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'block'
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  component={Link}
                  to="/contact"
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    height: '40px',
                    paddingTop: '10px',
                    position: 'relative',
                    textDecoration: 'none',
                    alignItems: 'flex-start',
                    overflow: 'hidden'
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '18px',
                      lineHeight: 1.2,
                      fontWeight: 400,
                      fontStyle: 'normal',
                      color: '#737373',
                      whiteSpace: 'nowrap',
                      fontVariationSettings: "'opsz' 14"
                    }}
                  >
                    Contact Us
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '2px',
                      height: '1px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      component="img"
                      src={FIGMA_ASSETS.navLine}
                      alt=""
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'block'
                      }}
                    />
                  </Box>
                </Box>
              </>
            )}
          </Box>

          {/* Desktop Buttons - Positioned at x=1059, y=18, width=261, height=45 */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: '20px',
            position: 'absolute',
            left: { md: '1059px' },
            top: '18px',
            width: '261px',
            height: '45px'
          }}>
            {/* List Property Button */}
            <Box
              component={Link}
              to="/list-property"
              sx={{
                border: '0.896px solid #17badf',
                borderRadius: '4px',
                height: '40px',
                paddingX: '2rem',
                paddingY: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                position: 'relative',
                textDecoration: 'none',
                cursor: 'pointer',
                bgcolor: 'white',
                overflow: 'hidden',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '16px',
                  lineHeight: 1.2,
                  fontWeight: 550,
                  fontStyle: 'normal',
                  color: '#17badf',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  fontVariationSettings: "'opsz' 14"
                }}
              >
                {listPropertyText}
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '-0.7px',
                  left: '-0.9px',
                  width: '1.792px',
                  height: '1px',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="img"
                  src={FIGMA_ASSETS.buttonLine}
                  alt=""
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'block'
                  }}
                />
              </Box>
            </Box>
            {/* Log In Button - width=93 */}
            <Box
              component={Link}
              to="/login"
              sx={{
                bgcolor: '#17badf',
                border: '0.896px solid #17badf',
                borderRadius: '4px',
                height: '40px',
                paddingX: '2rem',
                paddingY: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                position: 'relative',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '16px',
                  lineHeight: 1.2,
                  fontWeight: 650,
                  fontStyle: 'normal',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  fontVariationSettings: "'opsz' 14"
                }}
              >
                {loginText}
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '-0.7px',
                  left: '-0.9px',
                  width: '1.792px',
                  height: '1px',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="img"
                  src={FIGMA_ASSETS.buttonLine}
                  alt=""
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'block'
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="open drawer"
            edge="end"
            onClick={handleMobileMenuOpen}
            sx={{
              display: { xs: 'block', md: 'none' },
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666666'
            }}
          >
            <MenuIcon />
          </IconButton>
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
