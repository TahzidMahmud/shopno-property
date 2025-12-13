import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Link, IconButton, CircularProgress } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { footerService } from '../services/headerFooterService';
import { FooterQuickLink, FooterDiscoverLink, FooterSocialLink } from '../types/HeaderFooter';

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [quickLinks, setQuickLinks] = useState<FooterQuickLink[]>([]);
  const [discoverLinks, setDiscoverLinks] = useState<FooterDiscoverLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<FooterSocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      const data = await footerService.getAll();
      setSettings(data.settings || {});
      setQuickLinks(data.quick_links || []);
      setDiscoverLinks(data.discover_links || []);
      setSocialLinks(data.social_links || []);
    } catch (error) {
      console.error('Error loading footer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '/assets/shopno-property-logo-white.png';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <FacebookIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'twitter':
        return <TwitterIcon />;
      case 'instagram':
        return <InstagramIcon />;
      default:
        return null;
    }
  };

  const logoUrl = getImageUrl(settings.logo);
  const address = settings.address || 'Rupayan Taj, 1, 1/1 Naya Paltan, Suite L\n- 5 (5th Floor), Culvert Road, Dhaka,';
  const phone = settings.phone || '+8801844-646633';
  const email = settings.email || 'info.shopnoproperty@gmail.com';
  const copyright = settings.copyright || '© 2025 Shopno Property – All Rights Reserved';
  const privacyUrl = settings.privacy_policy_url || '#';
  const termsUrl = settings.terms_url || '#';
  const ctaPhone = settings.cta_phone || '(+88) 01324 730 515';
  const ctaHours = settings.cta_hours || 'Monday - Friday: 8am - 9pm';

  if (loading) {
    return (
      <Box sx={{ backgroundColor: '#000000', color: 'white', py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }
  return (
    <Box sx={{ backgroundColor: '#000000', color: 'white' }}>
      <Box sx={{ py: 8, px: { xs: 2, md: 4, lg: 8 }, maxWidth: '1280px', mx: 'auto' }}>
        <Grid container spacing={4}>
          {/* Column 1: Logo, Address, Follow Us */}
          <Grid item xs={12} md={4}>
            <Box component="img" src={logoUrl} alt="Shopno Property Logo" sx={{ height: 40, mb: 2 }} />
            <Typography variant="h6" sx={{ color:'#FFFFFF',fontWeight: 'bold', mb: 2 }}>
              Our Address
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {address}
            </Typography>
            <Typography variant="h6" sx={{ color:'#FFFFFF',fontWeight: 'bold', mb: 2 }}>
              Follow Us
            </Typography>
            <Box>
              {socialLinks
                .filter(link => link.is_active)
                .map((link) => (
                  <IconButton
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'white', border: '1px solid grey', borderRadius: '50%', mr: 1 }}
                  >
                    {getSocialIcon(link.platform)}
                  </IconButton>
                ))}
            </Box>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ color:'#FFFFFF',fontWeight: 'bold', mb: 3 }}>
              Quick Links
            </Typography>
            {quickLinks
              .filter(link => link.is_active)
              .map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  color="inherit"
                  underline="none"
                  display="block"
                  sx={{ mb: 1 }}
                >
                  {link.label}
                </Link>
              ))}
          </Grid>

          {/* Column 3: Discover */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color:'#FFFFFF',fontWeight: 'bold', mb: 3 }}>
              Discover
            </Typography>
            {discoverLinks
              .filter(link => link.is_active)
              .map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  color="inherit"
                  underline="none"
                  display="block"
                  sx={{ mb: 1 }}
                >
                  {link.label}
                </Link>
              ))}
          </Grid>

          {/* Column 4: Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color:'#FFFFFF',fontWeight: 'bold', mb: 3 }}>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1 }} />
              <Typography variant="body2">{phone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1 }} />
              <Typography variant="body2">{email}</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section: Copyright and Legal */}
        <Box sx={{ borderTop: '1px solid grey.700', pt: 3, mt: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mb: { xs: 1, sm: 0 } }}>
            {copyright}
          </Typography>
          <Box>
            <Link href={privacyUrl} color="inherit" underline="none" sx={{ mr: 2 }}>Privacy Policy</Link>
            <Link href={termsUrl} color="inherit" underline="none">Terms & Conditions</Link>
          </Box>
        </Box>
      </Box>

      {/* Bottommost Section: Call to Action Bar */}
      <Box sx={{ backgroundColor: 'info.main', color: 'white', py: 2, mt: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          <PhoneIcon sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
            Need help? Call us on {ctaPhone}
          </Typography>
          <Typography variant="body2">
            {ctaHours}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
