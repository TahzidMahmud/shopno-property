import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Placeholder for logo image */}
          <img src="/assets/shopno-logo.png" alt="Shopno Property Logo" style={{ height: 40 }} />
          <Typography variant="h6" component="div"> {/* Using h6 for now, will revert to logo after fixing */}
            SHOPNO <Box component="span" sx={{ display: 'block', fontSize: '0.8em', fontWeight: 400 }}>PROPERTY</Box>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
          <Link to="/properties" style={{ textDecoration: 'none', color: 'inherit' }}>Properties</Link>
          <Link to="/projects" style={{ textDecoration: 'none', color: 'inherit' }}>Projects</Link> {/* Add Projects link */}
          {/* Pages Dropdown */}
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          >
            Pages
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'pages-button',
            }}
          >
            <MenuItem onClick={handleMenuClose} component={Link} to="/property-details">Property Details</MenuItem>
            <MenuItem onClick={handleMenuClose}>Page 2</MenuItem>
            <MenuItem onClick={handleMenuClose}>Page 3</MenuItem>
          </Menu>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="outlined" color="primary">List Property</Button>
          <Button variant="contained" color="primary">Log In</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
