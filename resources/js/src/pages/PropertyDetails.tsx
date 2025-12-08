import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, IconButton, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Paper } from '@mui/material';
import { ArrowBack, ArrowForward, ArrowOutward, PlayArrow, Phone, Store, AccountBalance, Flight, School, LocalHospital, Train } from '@mui/icons-material';
import Footer from '../components/Footer';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/Property';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await propertyService.getById(parseInt(id));
        setPropertyData(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load property details');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Transform API data to match component structure
  const getImageUrl = (path: string | undefined) => {
    if (!path) return '/assets/house1.jpg'; // Fallback placeholder
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const property = propertyData ? {
    title: propertyData.title || 'Property',
    mainImage: getImageUrl(propertyData.main_image),
    description: propertyData.full_address || 'Get into the most profitable investment industry and turn your sale money into profits.',
    details: [
      { label: 'Status', value: propertyData.status || 'N/A' },
      { label: 'Area', value: propertyData.area || 'N/A' },
      { label: 'Location', value: propertyData.location || 'N/A' },
      { label: 'Type', value: propertyData.type || 'N/A' },
      { label: 'Total Floor', value: propertyData.total_floor?.toString() || 'N/A' },
      { label: 'Total Flat', value: propertyData.total_flat?.toString() || 'N/A' },
      { label: 'Flat Size', value: propertyData.flat_size ? `${propertyData.flat_size} Sq Ft` : 'N/A' },
      { label: 'Total Parking', value: propertyData.total_parking?.toString() || 'N/A' },
      { label: 'Price Range', value: propertyData.price_range || 'N/A' },
    ],
    galleryImages: propertyData.gallery_images && propertyData.gallery_images.length > 0
      ? propertyData.gallery_images.map(img => getImageUrl(img))
      : [getImageUrl(propertyData.main_image)],
    layoutImages: propertyData.layout_images && propertyData.layout_images.length > 0
      ? propertyData.layout_images.map(img => getImageUrl(img))
      : [getImageUrl(propertyData.main_image)],
    galleryImagesGrid: [
      ...(propertyData.gallery_images?.map(img => getImageUrl(img)) || []),
      ...(propertyData.layout_images?.map(img => getImageUrl(img)) || []),
      ...(propertyData.main_image ? [getImageUrl(propertyData.main_image)] : [])
    ].slice(0, 6), // Limit to 6 images
    videoThumbnail: propertyData.demo_video ? getImageUrl(propertyData.demo_video) : '/assets/video_thumbnail.html',
    keyTransports: propertyData.key_transports || [],
    latitude: propertyData.latitude,
    longitude: propertyData.longitude,
    bookingFormBg: propertyData.booking_form_background_image ? getImageUrl(propertyData.booking_form_background_image) : '/assets/house1.jpg',
    facilities: propertyData.facilities && propertyData.facilities.length > 0
      ? propertyData.facilities.map((facility, index) => ({
          icon: facility.title?.charAt(0).toUpperCase() || String.fromCharCode(65 + index),
          name: facility.title || 'Facility',
          image: facility.image ? getImageUrl(facility.image) : undefined,
        }))
      : [
          { icon: 'A', name: 'Surveillance System', image: undefined },
          { icon: 'B', name: '24x7 Security', image: undefined },
          { icon: 'C', name: 'Firefighting System', image: undefined },
          { icon: 'D', name: 'Swimming Pool', image: undefined },
        ],
  } : {
    title: 'Loading...',
    mainImage: '/assets/house1.jpg',
    description: '',
    details: [],
    galleryImages: [],
    layoutImages: [],
    galleryImagesGrid: [],
    videoThumbnail: '/assets/video_thumbnail.html',
    keyTransports: [],
    latitude: undefined,
    longitude: undefined,
    bookingFormBg: '/assets/house1.jpg',
    facilities: [],
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentLayoutImageIndex, setCurrentLayoutImageIndex] = useState(0); // New state for layout carousel

  // State for Installment Calculation
  const [propertyName, setPropertyName] = useState(propertyData?.title || 'Shopno Property House');
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [loanPeriod, setLoanPeriod] = useState(5); // Years
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(20); // Percentage
  const [monthlyInstallment, setMonthlyInstallment] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);

  // State for Booking Form
  const [bookingFormData, setBookingFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    projectType: '',
    projectDetails: '',
  });

  // Update property name when property data loads
  useEffect(() => {
    if (propertyData?.title) {
      setPropertyName(propertyData.title);
    }
  }, [propertyData]);

  const handlePreviousImage = () => {
    if (property.galleryImages.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? property.galleryImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (property.galleryImages.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === property.galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousLayoutImage = () => {
    if (property.layoutImages.length === 0) return;
    setCurrentLayoutImageIndex((prevIndex) =>
      prevIndex === 0 ? property.layoutImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextLayoutImage = () => {
    if (property.layoutImages.length === 0) return;
    setCurrentLayoutImageIndex((prevIndex) =>
      prevIndex === property.layoutImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleCalculate = () => {
    const price = propertyPrice;
    const downPayment = price * (downPaymentPercentage / 100);
    const loanAmount = price - downPayment;
    const monthlyInterestRate = 0.005; // Example: 0.5% per month
    const numberOfPayments = loanPeriod * 12;

    if (numberOfPayments === 0) {
      setMonthlyInstallment(loanAmount); // If loan period is 0, full amount is due immediately
    } else {
      const installment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
      setMonthlyInstallment(Math.round(installment));
    }
    setDueAmount(Math.round(loanAmount));
  };

  useEffect(() => {
    handleCalculate();
  }, [propertyPrice, loanPeriod, downPaymentPercentage]);

  // Get transport icon
  const getTransportIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      store: <Store sx={{ fontSize: 24 }} />,
      supermarket: <Store sx={{ fontSize: 24 }} />,
      bank: <AccountBalance sx={{ fontSize: 24 }} />,
      airport: <Flight sx={{ fontSize: 24 }} />,
      university: <School sx={{ fontSize: 24 }} />,
      school: <School sx={{ fontSize: 24 }} />,
      hospital: <LocalHospital sx={{ fontSize: 24 }} />,
      railway: <Train sx={{ fontSize: 24 }} />,
      station: <Train sx={{ fontSize: 24 }} />,
    };
    return iconMap[iconName.toLowerCase()] || <Store sx={{ fontSize: 24 }} />;
  };

  // Generate Google Maps embed URL (using standard embed format)
  const getMapUrl = () => {
    if (property.latitude && property.longitude) {
      return `https://www.google.com/maps?q=${property.latitude},${property.longitude}&output=embed`;
    } else if (propertyData?.full_address) {
      return `https://www.google.com/maps?q=${encodeURIComponent(propertyData.full_address)}&output=embed`;
    }
    return `https://www.google.com/maps?q=Dhaka,Bangladesh&output=embed`;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking form submission
    console.log('Booking form submitted:', bookingFormData);
    alert('Thank you for your interest! We will contact you soon.');
    setBookingFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      projectType: '',
      projectDetails: '',
    });
  };

  const isFirstSlide = currentImageIndex === 0;
  const isLastSlide = property.galleryImages.length > 0 && currentImageIndex === property.galleryImages.length - 1;

  const isFirstLayoutSlide = currentLayoutImageIndex === 0;
  const isLastLayoutSlide = property.layoutImages.length > 0 && currentLayoutImageIndex === property.layoutImages.length - 1;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !propertyData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Property not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url(${property.mainImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: { xs: '250px', sm: '300px', md: '400px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          px: { xs: 2, md: 0 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
          },
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', zIndex: 1, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}>
          {property.title}
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        {/* Why Invest Section */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: { xs: 6, md: 8 }, height: { xs: 6, md: 8 }, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Property details</Typography>
          </Box>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={7}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
                Why Should You Invest In This <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: { xs: 0.5, md: 1 }, py: { xs: 0.3, md: 0.5 }, borderRadius: 1, fontSize: { xs: '1.2rem', md: 'inherit' } }}>Property</Box>
              </Typography>
              <Box sx={{ position: 'relative', width: '100%', height: { xs: '250px', sm: '300px', md: '350px' }, borderRadius: 2 }}> {/* New wrapper Box for image and arrows */}
                <CardMedia
                  component="img"
                  image={property.galleryImages[currentImageIndex]}
                  alt="Property Gallery"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '50%', // Adjust height of the gradient as needed
                    background: 'linear-gradient(to top, rgba(0,188,212,0.8) 0%, rgba(0,188,212,0) 100%)', // Blue gradient
                    borderRadius: '0 0 8px 8px', // Match image border radius
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    left: { xs: 5, md: -15 }, // Position inside on mobile, outside on desktop
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: isFirstSlide ? 'white' : 'primary.main',
                    color: isFirstSlide ? 'black' : 'white',
                    border: isFirstSlide ? '1px solid #e0e0e0' : 'none',
                    boxShadow: isFirstSlide ? 1 : 'none',
                    borderRadius: '8px', // Rounded rectangle
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    '&:hover': { bgcolor: isFirstSlide ? '#f0f0f0' : 'primary.dark' },
                  }}
                  onClick={handlePreviousImage}
                >
                  <ArrowBack sx={{ fontSize: { xs: 20, md: 24 } }} />
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: { xs: 5, md: -15 }, // Position inside on mobile, outside on desktop
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: isLastSlide ? 'white' : 'primary.main',
                    color: isLastSlide ? 'black' : 'white',
                    border: isLastSlide ? '1px solid #e0e0e0' : 'none',
                    boxShadow: isLastSlide ? 1 : 'none',
                    borderRadius: '8px', // Rounded rectangle
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    '&:hover': { bgcolor: isLastSlide ? '#f0f0f0' : 'primary.dark' },
                  }}
                  onClick={handleNextImage}
                >
                  <ArrowForward sx={{ fontSize: { xs: 20, md: 24 } }} />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, md: 3 }, fontSize: { xs: '0.875rem', md: '0.9375rem' } }}>
                {property.description}
              </Typography>
              <Grid container spacing={2}>
                {property.details.map((detail, index) => (
                  <Grid item xs={12} key={index}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>{detail.label}: <Box component="span" sx={{ fontWeight: 'normal', color: 'text.secondary' }}>{detail.value}</Box></Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* Facilities Section */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: { xs: 6, md: 8 }, height: { xs: 6, md: 8 }, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Our Facilities</Typography>
          </Box>
          <Grid container spacing={{ xs: 2, md: 4 }}> {/* Use Grid for layout of text and cards container */}
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: { xs: 2, md: 4 }, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
                Explore <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: { xs: 0.5, md: 1 }, py: { xs: 0.3, md: 0.5 }, borderRadius: 1, fontSize: { xs: '1.2rem', md: 'inherit' } }}>Our</Box> Facilities
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'flex-end' }, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: { xs: 2, md: 4 }, fontSize: { xs: '0.8rem', md: '0.875rem' }, textAlign: { xs: 'left', md: 'right' } }}>
                Shopno Property is Innovating the Concept of Living
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ bgcolor: '#3f2e5b', borderRadius: 2, p: { xs: 2, md: 4 } }}> {/* Dark purple container for cards */}
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {property.facilities.map((facility, index) => (
                <Grid item xs={6} sm={6} md={3} key={index}>
                  <Card sx={{ textAlign: 'center', p: { xs: 2, md: 3 }, boxShadow: 3, borderRadius: '8px', bgcolor: 'white' }}>
                    <CardContent sx={{ p: { xs: '8px !important', md: '16px !important' } }}>
                      <Box sx={{
                        width: { xs: 50, md: 60 },
                        height: { xs: 50, md: 60 },
                        borderRadius: '8px',
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: { xs: 1, md: 2 },
                        color: 'primary.main',
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        fontWeight: 'bold',
                        overflow: 'hidden',
                      }}>
                        {facility.image ? (
                          <CardMedia
                            component="img"
                            image={facility.image}
                            alt={facility.name}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          facility.icon
                        )}
                      </Box>
                      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: 'black', fontSize: { xs: '0.8rem', md: '1rem' } }}>{facility.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Our Layout Section */}
        <Box sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: { xs: 6, md: 8 }, height: { xs: 6, md: 8 }, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Gallery</Typography>
          </Box>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: { xs: 2, md: 4 }, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
            Our <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: { xs: 0.5, md: 1 }, py: { xs: 0.3, md: 0.5 }, borderRadius: 1, fontSize: { xs: '1.2rem', md: 'inherit' } }}>Layout</Box>
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', height: { xs: '300px', sm: '400px', md: '500px' }, borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              image={property.layoutImages[currentLayoutImageIndex]}
              alt="Property Layout"
              sx={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 2 }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                left: { xs: 5, md: -15 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'white',
                color: 'black',
                border: '1px solid #e0e0e0',
                boxShadow: 1,
                borderRadius: '8px',
                width: { xs: 36, md: 40 },
                height: { xs: 36, md: 40 },
                '&:hover': { bgcolor: '#f0f0f0' },
              }}
              onClick={handlePreviousLayoutImage}
            >
              <ArrowBack sx={{ fontSize: { xs: 20, md: 24 } }} />
            </IconButton>
            <IconButton
              sx={{
                position: 'absolute',
                right: { xs: 5, md: -15 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'primary.main',
                color: 'white',
                border: 'none',
                boxShadow: 'none',
                borderRadius: '8px',
                width: { xs: 36, md: 40 },
                height: { xs: 36, md: 40 },
                '&:hover': { bgcolor: 'primary.dark' },
              }}
              onClick={handleNextLayoutImage}
            >
              <ArrowForward sx={{ fontSize: { xs: 20, md: 24 } }} />
            </IconButton>
          </Box>
        </Box>

        {/* Explore Our Gallery Section */}
        <Box sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 } }}>
          <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: { xs: 6, md: 8 }, height: { xs: 6, md: 8 }, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Gallery</Typography>
              </Box>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: { xs: 2, md: 4 }, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
                Explore <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: { xs: 0.5, md: 1 }, py: { xs: 0.3, md: 0.5 }, borderRadius: 1, fontSize: { xs: '1.2rem', md: 'inherit' } }}>Our</Box> Gallery
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button variant="outlined" color="primary" endIcon={<ArrowOutward />} sx={{ fontSize: { xs: '0.85rem', md: '1rem' }, padding: { xs: '8px 16px', md: '10px 20px' } }}>
                View All
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {property.galleryImagesGrid.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CardMedia
                  component="img"
                  image={image}
                  alt={`Gallery Image ${index + 1}`}
                  sx={{ width: '100%', height: { xs: 180, md: 200 }, objectFit: 'cover', borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Video Tours Section */}
        <Box sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: { xs: 6, md: 8 }, height: { xs: 6, md: 8 }, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Video</Typography>
          </Box>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: { xs: 2, md: 4 }, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
            Video Tours
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 800, height: { xs: 250, sm: 350, md: 450 }, mx: 'auto', borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              image={property.videoThumbnail}
              alt="Video Thumbnail"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: 60, md: 100 },
                height: { xs: 60, md: 100 },
                borderRadius: '50%',
                bgcolor: '#3f2e5b', // Dark purple background
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&::before': { // Inner concentric circle
                  content: '""',
                  position: 'absolute',
                  width: { xs: 80, md: 120 },
                  height: { xs: 80, md: 120 },
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                },
                '&::after': { // Outer concentric circle
                  content: '""',
                  position: 'absolute',
                  width: { xs: 100, md: 140 },
                  height: { xs: 100, md: 140 },
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.1)',
                },
              }}
            >
              <PlayArrow sx={{ fontSize: { xs: 35, md: 60 }, color: 'white', zIndex: 1 }} />
            </Box>
          </Box>
        </Box>

        {/* Installment Calculation Section */}
        <Box sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: { xs: 2, md: 4 }, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
            Installment Calculation
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, p: { xs: 1, md: 2 } }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Property Name</InputLabel>
                  <Select
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value as string)}
                    label="Property Name"
                    sx={{ bgcolor: '#f0f0f0', borderRadius: 1 }}
                  >
                    <MenuItem value={propertyName}>{propertyName}</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Property Price"
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  fullWidth
                  sx={{ bgcolor: '#f0f0f0', borderRadius: 1 }}
                  InputProps={{ style: { borderRadius: '8px' } }}
                />
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Loan Period</InputLabel>
                  <Select
                    value={loanPeriod}
                    onChange={(e) => setLoanPeriod(Number(e.target.value))}
                    label="Loan Period"
                    sx={{ bgcolor: '#f0f0f0', borderRadius: 1 }}
                  >
                    <MenuItem value={1}>1 Year</MenuItem>
                    <MenuItem value={5}>5 Years</MenuItem>
                    <MenuItem value={10}>10 Years</MenuItem>
                    <MenuItem value={15}>15 Years</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Down Payment"
                  type="number"
                  value={downPaymentPercentage}
                  onChange={(e) => setDownPaymentPercentage(Number(e.target.value))}
                  fullWidth
                  sx={{ bgcolor: '#f0f0f0', borderRadius: 1 }}
                  InputProps={{
                    style: { borderRadius: '8px' },
                    endAdornment: <Typography variant="body2" sx={{ mr: 1 }}>%</Typography>
                  }}
                />
                <Button variant="contained" color="primary" onClick={handleCalculate} sx={{ py: 1.5, borderRadius: 1 }}>
                  Calculate Loan
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: { xs: 2, md: 3 }, boxShadow: 3, borderRadius: 2, bgcolor: 'white', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>Monthly Installment</Typography>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', mb: { xs: 2, md: 3 }, fontSize: { xs: '1.5rem', md: '2rem' } }}>BDT {monthlyInstallment.toLocaleString()}</Typography>
                  <Box sx={{ borderBottom: '1px solid #e0e0e0', mb: { xs: 2, md: 3 } }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>Due Amount</Typography>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>BDT {dueAmount.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Map and Location Details Section */}
        <Box sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 } }}>
          <Box sx={{ position: 'relative', width: '100%', height: { xs: '350px', sm: '400px', md: '500px' }, borderRadius: 2, overflow: 'hidden' }}>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={getMapUrl()}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {propertyData?.full_address && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: { xs: 10, md: 20 },
                  left: { xs: 10, md: 20 },
                  right: { xs: 10, md: 'auto' },
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
                  {propertyData.full_address}
                </Typography>
                {property.keyTransports && property.keyTransports.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: { xs: 1, md: 2 }, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      Key Transport
                    </Typography>
                    <Grid container spacing={{ xs: 1, md: 2 }}>
                      {property.keyTransports.map((transport, index) => (
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
        </Box>

        {/* Book Your Property Section */}
        <Box
          sx={{
            position: 'relative',
            backgroundImage: `url(${property.bookingFormBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            py: { xs: 4, md: 8 },
            mt: { xs: 4, md: 6 },
            mb: { xs: 4, md: 6 },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 } }}>
            <Paper
              sx={{
                position: 'relative',
                zIndex: 1,
                p: { xs: 2, md: 4 },
                borderRadius: 2,
                boxShadow: 6,
              }}
            >
              <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: { xs: 2, md: 3 }, textAlign: 'center', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Book Your Property
              </Typography>
              <Box
                component="form"
                onSubmit={handleBookingSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  required
                  value={bookingFormData.fullName}
                  onChange={(e) => setBookingFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  type="tel"
                  value={bookingFormData.phoneNumber}
                  onChange={(e) => setBookingFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={bookingFormData.email}
                  onChange={(e) => setBookingFormData(prev => ({ ...prev, email: e.target.value }))}
                  variant="outlined"
                />
                <FormControl fullWidth>
                  <InputLabel>Project Type</InputLabel>
                  <Select
                    value={bookingFormData.projectType}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, projectType: e.target.value }))}
                    label="Project Type"
                  >
                    <MenuItem value="apartment">Apartment</MenuItem>
                    <MenuItem value="villa">Villa</MenuItem>
                    <MenuItem value="penthouse">Penthouse</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Project Details"
                  required
                  multiline
                  rows={4}
                  value={bookingFormData.projectDetails}
                  onChange={(e) => setBookingFormData(prev => ({ ...prev, projectDetails: e.target.value }))}
                  variant="outlined"
                />
                <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, flexWrap: 'wrap' }}>
                  <Button variant="outlined" color="primary" sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: 1 }, minWidth: { xs: '100%', sm: 150 }, fontSize: { xs: '0.85rem', md: '1rem' } }}>
                    Download Brochure
                  </Button>
                  <Button variant="outlined" color="primary" sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: 1 }, minWidth: { xs: '100%', sm: 150 }, fontSize: { xs: '0.85rem', md: '1rem' } }}>
                    Payment Schedule
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      flex: { xs: '1 1 100%', md: 1 },
                      minWidth: { xs: '100%', md: 150 },
                      backgroundColor: '#00bcd4',
                      fontSize: { xs: '0.85rem', md: '1rem' },
                      '&:hover': { backgroundColor: '#00acc1' },
                    }}
                  >
                    Submit Request
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Container>

      {/* Sticky Footer/Call-to-Action Bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#00bcd4',
          color: 'white',
          py: { xs: 1, md: 1.5 },
          px: { xs: 1, md: 2 },
          zIndex: 1000,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 0.5, sm: 1 },
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <Phone sx={{ fontSize: { xs: 18, md: 20 } }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, textAlign: 'center' }}>
            Need help? Call us on (+88) 01844-733303
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' }, textAlign: 'center' }}>
          Manager: Firoz Khan - CEO
        </Typography>
      </Box>
      <Box sx={{ height: { xs: '80px', sm: '60px' } }} /> {/* Spacer for sticky footer */}

      <Footer />
    </Box>
  );
};

export default PropertyDetails;
