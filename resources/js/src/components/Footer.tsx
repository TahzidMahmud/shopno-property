import React from 'react';
import { Box, Typography, Grid, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter'; // Using for X/Twitter
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: '#000000', color: 'white' }}>
      <Box sx={{ py: 8, px: { xs: 2, md: 4, lg: 8 }, maxWidth: '1280px', mx: 'auto' }}>
        <Grid container spacing={4}>
          {/* Column 1: Logo, Address, Follow Us */}
          <Grid item xs={12} md={4}>
            <Box component="img" src="/assets/shopno-property-logo-white.png" alt="Shopno Property Logo" sx={{ height: 40, mb: 2 }} /> {/* Placeholder Logo */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Our Address
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.8 }}>
              Rupayan Taj, 1, 1/1 Naya Paltan, Suite L <br />
              - 5 (5th Floor), Culvert Road, Dhaka,
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Follow Us
            </Typography>
            <Box>
              <IconButton sx={{ color: 'white', border: '1px solid grey', borderRadius: '50%', mr: 1 }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: 'white', border: '1px solid grey', borderRadius: '50%', mr: 1 }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton sx={{ color: 'white', border: '1px solid grey', borderRadius: '50%', mr: 1 }}>
                <TwitterIcon /> {/* Using TwitterIcon for X */}
              </IconButton>
              <IconButton sx={{ color: 'white', border: '1px solid grey', borderRadius: '50%' }}>
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Quick Links
            </Typography>
            <Link href="#" color="inherit" underline="none" display="block" sx={{ mb: 1 }}>About Us</Link>
            <Link href="#" color="inherit" underline="none" display="block" sx={{ mb: 1 }}>Property</Link>
            <Link href="#" color="inherit" underline="none" display="block" sx={{ mb: 1 }}>Blog</Link>
            <Link href="#" color="inherit" underline="none" display="block" sx={{ mb: 1 }}>Contact Us</Link>
          </Grid>

          {/* Column 3: Discover */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Discover
            </Typography>
            <Link href="#" color="inherit" underline="none" display="block" sx={{ mb: 1 }}>Dhanmondi's</Link>
            <Link href="#" color="inherit" underline="none" display="block" sx={{ mb: 1 }}>Gulshan</Link>
            <Link href="#" color="inherit" underline="none" display="block" sx={{ mb: 1 }}>Basundhara</Link>
            <Link href="#" color="inherit" underline="none" display="block" sx={{ mb: 1 }}>Khulna</Link>
          </Grid>

          {/* Column 4: Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1 }} />
              <Typography variant="body2">+8801844-646633</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1 }} />
              <Typography variant="body2">info.shopnoproperty@gmail.com</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section: Copyright and Legal */}
        <Box sx={{ borderTop: '1px solid grey.700', pt: 3, mt: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mb: { xs: 1, sm: 0 } }}>
            &copy; 2025 Shopno Property – All Rights Reserved
          </Typography>
          <Box>
            <Link href="#" color="inherit" underline="none" sx={{ mr: 2 }}>Privacy Policy</Link>
            <Link href="#" color="inherit" underline="none">Terms & Conditions</Link>
          </Box>
        </Box>
      </Box>

      {/* Bottommost Section: Call to Action Bar */}
      <Box sx={{ backgroundColor: 'info.main', color: 'white', py: 2, mt: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PhoneIcon sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
            Need help? Call us on (+88) 01324 730 515
          </Typography>
          <Typography variant="body2">
            Monday - Friday: 8am - 9pm
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
