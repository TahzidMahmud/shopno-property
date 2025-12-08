import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel, Paper, CircularProgress } from '@mui/material';
import { Phone, Email, Store, AccountBalance, Flight, School, LocalHospital, Train } from '@mui/icons-material';
import { contactPageService } from '../services/contactPageService';
import { ContactPageData, ContactPageKeyTransport } from '../types/ContactPage';
import PartnersSection from '../components/PartnersSection';

const Contact: React.FC = () => {
  const [pageData, setPageData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    project: '',
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const data = await contactPageService.getAll();
      setPageData(data);
    } catch (error) {
      console.error('Error loading contact page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '/assets/house1.jpg';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const getMapUrl = () => {
    const address = pageData?.settings?.map_address || pageData?.settings?.address || 'Dhaka, Bangladesh';
    const lat = pageData?.settings?.map_latitude;
    const lng = pageData?.settings?.map_longitude;
    
    if (lat && lng) {
      return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    } else if (address) {
      return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
    }
    return `https://www.google.com/maps?q=Dhaka,Bangladesh&output=embed`;
  };

  const getTransportIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      'airplane': <Flight sx={{ fontSize: 24, color: '#00bcd4' }} />,
      'train': <Train sx={{ fontSize: 24, color: '#00bcd4' }} />,
      'school': <School sx={{ fontSize: 24, color: '#00bcd4' }} />,
      'hospital': <LocalHospital sx={{ fontSize: 24, color: '#00bcd4' }} />,
      'bank': <AccountBalance sx={{ fontSize: 24, color: '#00bcd4' }} />,
      'store': <Store sx={{ fontSize: 24, color: '#00bcd4' }} />,
    };
    return iconMap[iconName.toLowerCase()] || <Store sx={{ fontSize: 24, color: '#00bcd4' }} />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your enquiry! We will contact you soon.');
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      project: '',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const settings = pageData?.settings || {};
  const keyTransports = pageData?.key_transports || [];

  // Default values if not set
  const heroTitle = settings.hero_title || 'Contact Us';
  const heroBackground = getImageUrl(settings.hero_background_image);
  const sectionTitle = settings.section_title || 'Get In Touch';
  const formHeading = settings.form_heading || 'Enquiry';
  const formDescription = settings.form_description || 'Wish to get a call back from our team? Fill in your details.';
  const formEmail = settings.form_email || 'contact@example.com';
  const address = settings.address || 'Rupayan Taj, 1, 1/1 Naya Paltan, Suite L - 5 (5th Floor), Culvert Road, Dhaka,';
  const phone = settings.phone || '+8801844-646633';
  const email = settings.email || 'info.shopnoproperty@gmail.com';
  const mapAddress = settings.map_address || address;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: { xs: '300px', sm: '400px', md: '500px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            zIndex: 1,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            fontFamily: 'serif'
          }}
        >
          {heroTitle}
        </Typography>
      </Box>

      {/* Get In Touch Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 4, md: 6 },
            color: '#00bcd4',
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          {sectionTitle}
        </Typography>

        <Grid container spacing={{ xs: 3, md: 6 }}>
          {/* Left Column - Form */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                {formHeading}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                {formDescription}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                <TextField
                  fullWidth
                  label="Enter your Full Name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Enter your email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                  For direct enquiry {formEmail}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Project</InputLabel>
                  <Select
                    value={formData.project}
                    onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                    label="Project"
                  >
                    <MenuItem value="apartment">Apartment</MenuItem>
                    <MenuItem value="villa">Villa</MenuItem>
                    <MenuItem value="penthouse">Penthouse</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: '#00bcd4',
                    color: 'white',
                    py: 1.5,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    '&:hover': {
                      backgroundColor: '#00acc1',
                    },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Address & Contact */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                Address
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                {address}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Phone sx={{ fontSize: 28, color: '#00bcd4' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      Call Us
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                      {phone}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ fontSize: 28, color: '#00bcd4' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                      {email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Map Section */}
      <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 0, md: 0 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 0, md: 3 } }}>
          <Box sx={{ position: 'relative', width: '100%', height: { xs: '400px', sm: '500px', md: '600px' }, borderRadius: { xs: 0, md: 2 }, overflow: 'hidden' }}>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={getMapUrl()}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {mapAddress && (
              <Paper
                sx={{
                  position: 'absolute',
                  bottom: { xs: 10, md: 20 },
                  right: { xs: 10, md: 20 },
                  p: { xs: 2, md: 3 },
                  maxWidth: { xs: 'calc(100% - 20px)', md: 400 },
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: 'white',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: { xs: 1, md: 2 }, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  Address
                </Typography>
                <Typography variant="body2" sx={{ mb: { xs: 2, md: 3 }, lineHeight: 1.8, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  {mapAddress}
                </Typography>
                {keyTransports.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: { xs: 1, md: 2 }, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      Key Transport
                    </Typography>
                    <Grid container spacing={{ xs: 1, md: 2 }}>
                      {keyTransports.map((transport, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 }, mb: { xs: 1, md: 1.5 } }}>
                            <Box sx={{ color: '#00bcd4', display: 'flex', alignItems: 'center' }}>
                              {getTransportIcon(transport.icon)}
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                {transport.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                                {transport.distance}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Paper>
            )}
          </Box>
        </Container>
      </Box>

      {/* Partners Section */}
      <PartnersSection />
    </Box>
  );
};

export default Contact;

