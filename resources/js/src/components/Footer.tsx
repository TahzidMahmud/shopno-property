import React, { useState, useEffect } from 'react';
import { Box, Typography, Link, IconButton, CircularProgress } from '@mui/material';
import { footerService } from '../services/headerFooterService';
import { FooterQuickLink, FooterDiscoverLink, FooterSocialLink } from '../types/HeaderFooter';

// Figma Asset URLs (valid for 7 days)
const FIGMA_ASSETS = {
  logo: 'https://www.figma.com/api/mcp/asset/6682c1f9-71e8-40f8-ad39-a19a909cbcbb',
  supportIcon: 'https://www.figma.com/api/mcp/asset/08b48f3b-7a07-4391-9657-3e641999e82f',
  vectorBg: 'https://www.figma.com/api/mcp/asset/c26b7d57-8da7-46b8-8d74-2d6cb96c6695',
  dividerLine: 'https://www.figma.com/api/mcp/asset/73d97775-b88b-469c-a9ba-ab41fd3ccd45',
  facebookCircle: 'https://www.figma.com/api/mcp/asset/48c6ec0f-d8da-49f8-8a51-bb182b39b87b',
  facebookIcon: 'https://www.figma.com/api/mcp/asset/c8ce42e0-0f02-4116-bcf5-c3371a79553c',
  linkedinIcon: 'https://www.figma.com/api/mcp/asset/a7b57ef8-3ca3-4be3-905f-32121e0a4182',
  twitterIcon: 'https://www.figma.com/api/mcp/asset/31a427d7-4c56-43a6-8ddd-f6e868b1242a',
  instagramInner: 'https://www.figma.com/api/mcp/asset/08694bdd-5a5b-4180-a82d-1b0a600d8d36',
  instagramCircle: 'https://www.figma.com/api/mcp/asset/b3905627-d6bf-4767-bf66-47047f331154',
  phoneIcon: 'https://www.figma.com/api/mcp/asset/ebe36de3-f302-4b17-a574-d3765eedaeaf',
  emailIcon: 'https://www.figma.com/api/mcp/asset/f169de02-c3f5-43e2-8c58-bfa87540320e',
};

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
        return (
          <Box sx={{ position: 'relative', width: '24px', height: '24px' }}>
            <Box
              component="img"
              src={FIGMA_ASSETS.facebookCircle}
              alt="Facebook"
              sx={{ position: 'absolute', width: '24px', height: '24px', top: 0, left: 0 }}
            />
            <Box
              component="img"
              src={FIGMA_ASSETS.facebookIcon}
              alt="Facebook Icon"
              sx={{ position: 'absolute', width: '13.44px', height: '13.44px', top: '5.28px', left: '5.28px' }}
            />
          </Box>
        );
      case 'linkedin':
        return (
          <Box
            component="img"
            src={FIGMA_ASSETS.linkedinIcon}
            alt="LinkedIn"
            sx={{ width: '24px', height: '24px' }}
          />
        );
      case 'twitter':
        return (
          <Box
            component="img"
            src={FIGMA_ASSETS.twitterIcon}
            alt="Twitter"
            sx={{ width: '24px', height: '24px' }}
          />
        );
      case 'instagram':
        return (
          <Box sx={{ position: 'relative', width: '24px', height: '24px' }}>
            <Box
              component="img"
              src={FIGMA_ASSETS.instagramCircle}
              alt="Instagram"
              sx={{ position: 'absolute', width: '24px', height: '24px', top: 0, left: 0 }}
            />
            <Box
              component="img"
              src={FIGMA_ASSETS.instagramInner}
              alt="Instagram Icon"
              sx={{ position: 'absolute', width: '13.44px', height: '13.44px', top: '5.25px', left: '5.25px' }}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  // Use Figma logo asset, fallback to settings logo
  const logoUrl = settings.logo ? getImageUrl(settings.logo) : FIGMA_ASSETS.logo;
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
    <Box sx={{ backgroundColor: '#000000', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Vector Background - Vector 29 */}
      <Box
        sx={{
          position: 'absolute',
          left: 'calc(50% - 0.48px)',
          top: '191.55px',
          transform: 'translateX(-50%) rotate(0.765deg)',
          width: '1847.339px',
          height: '541.015px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'visible',
          '@media (max-width: 1440px)': {
            display: 'none' // Hide on smaller screens
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '1840.608px',
            height: '516.488px',
            overflow: 'visible'
          }}
        >
          <Box
            component="img"
            src={FIGMA_ASSETS.vectorBg}
            alt=""
            sx={{
              position: 'absolute',
              width: '144.89%', // Extends beyond container
              height: '374.06%', // Extends beyond container
              left: '-22.07%', // Offset to center
              top: '-136.53%', // Offset to center
              objectFit: 'contain',
              display: 'block',
              maxWidth: 'none'
            }}
          />
        </Box>
      </Box>

      {/* Main Footer Content */}
      <Box sx={{ py: { xs: 4, md: 7.5 }, px: { xs: 2, md: 7.5 }, maxWidth: '1440px', mx: 'auto', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: '125px' }, mb: 6 }}>
          {/* Column 1: Logo, Address, Follow Us */}
          <Box sx={{ width: { xs: '100%', md: '307px' } }}>
            <Box
              component="img"
              src={logoUrl}
              alt="Shopno Property Logo"
              sx={{
                height: '58.1px',
                width: '150px',
                mb: 3,
                objectFit: 'contain'
              }}
            />
            <Box sx={{ mb: 3.75 }}>
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: 1.4,
                  mb: 2.25,
                  fontFamily: "'DM Sans', sans-serif"
                }}
              >
                Our Address
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  lineHeight: 2,
                  whiteSpace: 'pre-line',
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '0.3px',
                  color: '#FFFFFF'
                }}
              >
                {address}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: 1.2,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.3px',
                  flexShrink: 0
                }}
              >
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                {socialLinks
                  .filter(link => link.is_active)
                  .map((link) => (
                    <Link
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'block',
                        width: '24px',
                        height: '24px',
                        '&:hover': {
                          opacity: 0.8
                        }
                      }}
                    >
                      {getSocialIcon(link.platform)}
                    </Link>
                  ))}
              </Box>
            </Box>
          </Box>

          {/* Column 2: Quick Links */}
          <Box sx={{ width: { xs: '100%', md: '114px' } }}>
            <Typography
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: 1.2,
                mb: 2.5,
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {quickLinks
                .filter(link => link.is_active)
                .map((link) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    color="inherit"
                    underline="none"
                    sx={{
                      fontSize: '16px',
                      lineHeight: 1.2,
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: '0.3px',
                      color: '#FFFFFF',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
            </Box>
          </Box>

          {/* Column 3: Discover */}
          <Box sx={{ width: { xs: '100%', md: '114px' } }}>
            <Typography
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: 1.2,
                mb: 2.5,
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Discover
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {discoverLinks
                .filter(link => link.is_active)
                .map((link) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    color="inherit"
                    underline="none"
                    sx={{
                      fontSize: '16px',
                      lineHeight: 1.2,
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: '0.3px',
                      color: '#FFFFFF',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
            </Box>
          </Box>

          {/* Column 4: Contact Info */}
          <Box sx={{ width: { xs: '100%', md: '291px' } }}>
            <Typography
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: 1.2,
                mb: 2.5,
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Phone */}
              <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Box
                  component="img"
                  src={FIGMA_ASSETS.phoneIcon}
                  alt="Phone"
                  sx={{ width: '24px', height: '24px', flexShrink: 0 }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 500,
                      lineHeight: 1.2,
                      mt: 0,
                      mb: 0,
                      fontFamily: "'DM Sans', sans-serif",
                      color: '#FFFFFF'
                    }}
                  >
                    Phone
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: 1.2,
                      mt: '8px',
                      fontFamily: "'Inter', sans-serif",
                      color: '#FFFFFF'
                    }}
                  >
                    {phone}
                  </Typography>
                </Box>
              </Box>
              {/* Email */}
              <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Box
                  component="img"
                  src={FIGMA_ASSETS.emailIcon}
                  alt="Email"
                  sx={{ width: '24px', height: '24px', flexShrink: 0 }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 500,
                      lineHeight: 1.2,
                      mt: 0,
                      mb: 0,
                      fontFamily: "'DM Sans', sans-serif",
                      color: '#FFFFFF'
                    }}
                  >
                    Email
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: 1.2,
                      mt: '8px',
                      fontFamily: "'Inter', sans-serif",
                      color: '#FFFFFF'
                    }}
                  >
                    {email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom Section: Copyright and Legal */}
        <Box
          sx={{
            pt: 3.75,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            position: 'relative',
            width: '100%',
            maxWidth: '1208px',
            mx: 'auto'
          }}
        >
          {/* Divider Line from Figma - Line 259 */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '1px',
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={FIGMA_ASSETS.dividerLine}
              alt=""
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: '12px',
              lineHeight: 1.2,
              color: '#bebfc3',
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            {copyright}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Link
              href={privacyUrl}
              color="inherit"
              underline="none"
              sx={{
                fontSize: '12px',
                lineHeight: 1.2,
                color: '#bebfc3',
                fontFamily: "'DM Sans', sans-serif",
                '&:hover': {
                  color: 'white'
                }
              }}
            >
              Privacy Policy
            </Link>
            <Typography
              sx={{
                fontSize: '12px',
                color: '#bebfc3',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              |
            </Typography>
            <Link
              href={termsUrl}
              color="inherit"
              underline="none"
              sx={{
                fontSize: '12px',
                lineHeight: 1.2,
                color: '#bebfc3',
                fontFamily: "'DM Sans', sans-serif",
                '&:hover': {
                  color: 'white'
                }
              }}
            >
              Terms & Conditions
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Bottommost Section: Call to Action Bar */}
      <Box sx={{ backgroundColor: '#17badf', color: 'white', py: 2.5, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '18px', maxWidth: '1440px', mx: 'auto', px: 2 }}>
          <Box
            component="img"
            src={FIGMA_ASSETS.supportIcon}
            alt="Support"
            sx={{ width: '30px', height: '30px', flexShrink: 0 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
            <Typography
              sx={{
                fontSize: '15px',
                fontWeight: 600,
                lineHeight: 1.4,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.3px',
                color: '#FFFFFF'
              }}
            >
              Need help? Call us on {ctaPhone}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                lineHeight: 1,
                fontFamily: "'Inter', sans-serif",
                color: '#FFFFFF'
              }}
            >
              {ctaHours}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
