import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, IconButton, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Paper } from '@mui/material';
import { ArrowBack, ArrowForward, ArrowOutward, PlayArrow, Phone, Store, AccountBalance, Flight, School, LocalHospital, Train } from '@mui/icons-material';
import Footer from '../components/Footer';
import { propertyService } from '../services/propertyService';
import { propertyQueryService } from '../services/propertyQueryService';
import { Property } from '../types/Property';
import { getYouTubeEmbedUrl, extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../utils/youtube';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

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

  const getFileUrl = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const handleDownload = (url: string | null, filename: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to format date
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Build details array conditionally - only include fields with values
  const buildDetailsArray = () => {
    const details: Array<{ label: string; value: string }> = [];
    
    if (propertyData.status) details.push({ label: 'Status', value: propertyData.status });
    if (propertyData.property_category) details.push({ label: 'Property Category', value: propertyData.property_category });
    if (propertyData.type) details.push({ label: 'Type', value: propertyData.type });
    if (propertyData.area) details.push({ label: 'Area', value: propertyData.area });
    if (propertyData.location) details.push({ label: 'Location', value: propertyData.location });
    if (propertyData.total_floor) details.push({ label: 'Total Floor', value: propertyData.total_floor.toString() });
    if (propertyData.total_flat) details.push({ label: 'Total Flat', value: propertyData.total_flat.toString() });
    if (propertyData.flat_size) details.push({ label: 'Flat Size', value: `${propertyData.flat_size} Sq Ft` });
    if (propertyData.total_parking) details.push({ label: 'Total Parking', value: propertyData.total_parking.toString() });
    if (propertyData.land) details.push({ label: 'Land', value: propertyData.land });
    if (propertyData.building_height) details.push({ label: 'Building Height', value: propertyData.building_height });
    if (propertyData.hand_over_date) details.push({ label: 'Hand Over Date', value: formatDate(propertyData.hand_over_date) });
    if (propertyData.face) details.push({ label: 'Face', value: propertyData.face });
    if (propertyData.road) details.push({ label: 'Road', value: propertyData.road });
    if (propertyData.bedrooms) details.push({ label: 'Bedrooms', value: propertyData.bedrooms.toString() });
    if (propertyData.bathrooms) details.push({ label: 'Bathrooms', value: propertyData.bathrooms.toString() });
    if (propertyData.price) details.push({ label: 'Price', value: `৳ ${propertyData.price.toLocaleString()}` });
    if (propertyData.company?.name) details.push({ label: 'Company', value: propertyData.company.name });
    
    return details;
  };

  const property = propertyData ? {
    title: propertyData.title || 'Property',
    mainImage: getImageUrl(propertyData.main_image),
    description: propertyData.description || propertyData.full_address || 'Get into the most profitable investment industry and turn your sale money into profits.',
    details: buildDetailsArray(),
    galleryImages: propertyData.gallery_images && propertyData.gallery_images.length > 0
      ? propertyData.gallery_images.map(img => getImageUrl(img))
      : [getImageUrl(propertyData.main_image)],
    featuredImages: propertyData.featured_images && propertyData.featured_images.length > 0
      ? propertyData.featured_images.map(img => getImageUrl(img))
      : (propertyData.gallery_images && propertyData.gallery_images.length > 0
        ? propertyData.gallery_images.map(img => getImageUrl(img))
        : [getImageUrl(propertyData.main_image)]),
    layoutImages: propertyData.layout_images && propertyData.layout_images.length > 0
      ? propertyData.layout_images.map(img => getImageUrl(img))
      : [getImageUrl(propertyData.main_image)],
    galleryImagesGrid: [
      ...(propertyData.gallery_images?.map(img => getImageUrl(img)) || []),
      ...(propertyData.layout_images?.map(img => getImageUrl(img)) || []),
      ...(propertyData.main_image ? [getImageUrl(propertyData.main_image)] : [])
    ].slice(0, 6), // Limit to 6 images
    videoUrl: propertyData.demo_video || null,
    videoThumbnail: propertyData.demo_video_thumbnail
      ? getImageUrl(propertyData.demo_video_thumbnail)
      : (propertyData.demo_video && extractYouTubeVideoId(propertyData.demo_video)
        ? getYouTubeThumbnailUrl(propertyData.demo_video, 'high')
        : '/assets/video_thumbnail.html'),
    brochure: getFileUrl(propertyData.brochure),
    paymentSchedule: getFileUrl(propertyData.payment_schedule),
    keyTransports: (propertyData.key_transports && Array.isArray(propertyData.key_transports))
      ? propertyData.key_transports.filter((t: any) => t && (t.name || t.distance))
      : [],
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
    videoUrl: null,
    videoThumbnail: '/assets/video_thumbnail.html',
    brochure: null,
    paymentSchedule: null,
    keyTransports: [],
    latitude: undefined,
    longitude: undefined,
    bookingFormBg: '/assets/house1.jpg',
    facilities: [],
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentFeaturedImageIndex, setCurrentFeaturedImageIndex] = useState(0); // State for featured images slider
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
    query: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handlePreviousFeaturedImage = () => {
    if ((property.featuredImages?.length || 0) === 0) return;
    setCurrentFeaturedImageIndex((prevIndex) =>
      prevIndex === 0 ? (property.featuredImages?.length || 1) - 1 : prevIndex - 1
    );
  };

  const handleNextFeaturedImage = () => {
    if ((property.featuredImages?.length || 0) === 0) return;
    setCurrentFeaturedImageIndex((prevIndex) =>
      prevIndex === (property.featuredImages?.length || 1) - 1 ? 0 : prevIndex + 1
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
  const getTransportIcon = (iconName: string | undefined | null) => {
    if (!iconName) {
      return <Store sx={{ fontSize: 24 }} />;
    }
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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyData?.id) {
      setSubmitError('Property information is missing');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await propertyQueryService.submit({
        property_id: propertyData.id,
        full_name: bookingFormData.fullName,
        phone_number: bookingFormData.phoneNumber,
        email: bookingFormData.email || undefined,
        query: bookingFormData.query,
      });

      setSubmitSuccess(true);
      setBookingFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        query: '',
      });

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to submit query. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFirstSlide = currentImageIndex === 0;
  const isLastSlide = property.galleryImages.length > 0 && currentImageIndex === property.galleryImages.length - 1;

  const isFirstFeaturedSlide = currentFeaturedImageIndex === 0;
  const isLastFeaturedSlide = (property.featuredImages?.length || 0) > 0 && currentFeaturedImageIndex === (property.featuredImages?.length || 1) - 1;

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
                Why Should You Invest In This <Box component="span" sx={{ bgcolor: '#00bcd4', color: 'white', px: 1.5, py: 0.5, borderRadius: '4px', transform: 'rotate(5deg)', display: 'inline-block', ml: 1 }}>Property</Box>
              </Typography>
              <Box sx={{ position: 'relative', width: '100%', height: { xs: '250px', sm: '300px', md: '350px' }, borderRadius: 2 }}> {/* New wrapper Box for image and arrows */}
                <CardMedia
                  component="img"
                  image={(property.featuredImages && property.featuredImages.length > 0)
                    ? property.featuredImages[currentFeaturedImageIndex]
                    : property.galleryImages[currentImageIndex]}
                  alt="Property Featured"
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
                    bgcolor: isFirstFeaturedSlide ? 'white' : 'primary.main',
                    color: isFirstFeaturedSlide ? 'black' : 'white',
                    border: isFirstFeaturedSlide ? '1px solid #e0e0e0' : 'none',
                    boxShadow: isFirstFeaturedSlide ? 1 : 'none',
                    borderRadius: '8px', // Rounded rectangle
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    '&:hover': { bgcolor: isFirstFeaturedSlide ? '#f0f0f0' : 'primary.dark' },
                  }}
                  onClick={handlePreviousFeaturedImage}
                >
                  <ArrowBack sx={{ fontSize: { xs: 20, md: 24 } }} />
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: { xs: 5, md: -15 }, // Position inside on mobile, outside on desktop
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: isLastFeaturedSlide ? 'white' : 'primary.main',
                    color: isLastFeaturedSlide ? 'black' : 'white',
                    border: isLastFeaturedSlide ? '1px solid #e0e0e0' : 'none',
                    boxShadow: isLastFeaturedSlide ? 1 : 'none',
                    borderRadius: '8px', // Rounded rectangle
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    '&:hover': { bgcolor: isLastFeaturedSlide ? '#f0f0f0' : 'primary.dark' },
                  }}
                  onClick={handleNextFeaturedImage}
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
                Explore <Box component="span" sx={{ bgcolor: '#00bcd4', color: 'white', px: 1.5, py: 0.5, borderRadius: '4px', transform: 'rotate(5deg)', display: 'inline-block', ml: 1 }}>Our</Box> Facilities
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
            Our Layout
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
                left: { xs: 5, md: -0 },
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
                right: { xs: 5, md: -0 },
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
                Explore <Box component="span" sx={{ bgcolor: '#00bcd4', color: 'white', px: 1.5, py: 0.5, borderRadius: '4px', transform: 'rotate(5deg)', display: 'inline-block', ml: 1 }}>Our</Box> Gallery
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
        {property.videoUrl && extractYouTubeVideoId(property.videoUrl) && (
          <Box sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Box sx={{ width: { xs: 6, md: 8 }, height: { xs: 6, md: 8 }, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Video</Typography>
            </Box>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: { xs: 2, md: 4 }, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
              Video Tours
            </Typography>
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 800, mx: 'auto', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
              {!videoPlaying ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    overflow: 'hidden',
                    borderRadius: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => setVideoPlaying(true)}
                >
                  <CardMedia
                    component="img"
                    image={property.videoThumbnail || undefined}
                    alt="Video Thumbnail"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
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
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translate(-50%, -50%) scale(1.1)',
                      },
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
              ) : (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    overflow: 'hidden',
                    borderRadius: 2,
                  }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      border: 0,
                    }}
                    src={`${getYouTubeEmbedUrl(property.videoUrl)}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Property Video Tour"
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}

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


      </Container>
       {/* Map and Location Details Section */}
        <Box sx={{ mt: { xs: 4, md: 6 }}}>
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
                  {propertyData.full_address}
                </Typography>
                {property.keyTransports && property.keyTransports.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: { xs: 1, md: 2 }, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      Key Transport
                    </Typography>
                    <Grid container spacing={{ xs: 1, md: 2 }}>
                      {property.keyTransports
                        .filter(transport => transport && (transport.name || transport.distance))
                        .map((transport, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 }, mb: { xs: 1, md: 1.5 } }}>
                            <Box sx={{ color: '#00bcd4', display: 'flex', alignItems: 'center' }}>
                              {getTransportIcon(transport?.icon)}
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                {transport?.name || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                                {transport?.distance || 'N/A'}
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
            minHeight: { xs: '500px', md: '500px' },
            py: { xs: 5, md: 7 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 3 } }}>
            <Paper
              sx={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '6px',
                boxShadow: 6,
                bgcolor: 'white',
                overflow: 'visible',
                width: { xs: '100%', md: '946px' },
                mx: 'auto',
                p: { xs: 2, md: '34px 24px 24px 24px' },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 2, md: 0 },
                minHeight: { xs: 'auto', md: 'auto' },
              }}
            >
              {/* Left Column - Image with Overlay Text */}
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: '100%', md: '337px' },
                  height: { xs: '250px', md: '294px' },
                  flexShrink: 0,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundImage: `url(${propertyData?.booking_form_image ? getImageUrl(propertyData.booking_form_image) : property.mainImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  mb: { xs: 2, md: 0 },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    color: 'white',
                    p: '30px 0 0 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    height: '118px',
                    width: { xs: 'calc(100% - 48px)', md: '286px' },
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: { xs: '32px', md: '40px' },
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: 'white',
                        textTransform: 'capitalize',
                        fontVariationSettings: "'opsz' 14",
                        mb: '55px',
                      }}
                    >
                      Book Your
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '166.739px',
                        height: '54.458px',
                        ml: '0.97px',
                        transform: 'rotate(4.4deg)',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: '#17badf',
                          px: '14px',
                          py: '10px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '42px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: { xs: '24px', md: '32px' },
                            fontWeight: 600,
                            lineHeight: 1.2,
                            color: '#fafafa',
                            fontVariationSettings: "'opsz' 14",
                          }}
                        >
                          Property
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: 1.4,
                      color: 'white',
                      width: { xs: '100%', md: '256px' },
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    We will confirm your appointment within 2 hours
                  </Typography>
                </Box>
              </Box>

              {/* Right Column - Form */}
              <Box
                component="form"
                onSubmit={handleBookingSubmit}
                sx={{
                  flex: 1,
                  width: { xs: '100%', md: '431px' },
                  ml: { xs: 0, md: '84px' },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 2, md: '24px' },
                  alignItems: { xs: 'stretch', md: 'flex-end' },
                }}
              >
                {/* Form Fields Container */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: '40px' }, width: '100%' }}>
                  {/* Full Name */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '16px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        color: '#1c1c1c',
                        mb: '5.16px',
                        fontVariationSettings: "'opsz' 14",
                      }}
                    >
                      Full Name*
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter Your Name"
                      required
                      value={bookingFormData.fullName}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:before': {
                          borderBottom: '1px solid #1c1c1c',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottom: '1px solid #1c1c1c',
                        },
                        '& .MuiInput-underline:hover:before': {
                          borderBottom: '1px solid #1c1c1c',
                        },
                        '& .MuiInputBase-input': {
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: 1.2,
                          color: '#1c1c1c',
                          paddingBottom: '5px',
                        },
                      }}
                    />
                  </Box>

                  {/* Phone Number and Email - Side by Side */}
                  <Box sx={{ display: 'flex', gap: { xs: 2, md: '24px' } }}>
                    {/* Phone Number */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '16px',
                          fontWeight: 600,
                          lineHeight: 1.2,
                          color: '#1c1c1c',
                          mb: '15.578px',
                          fontVariationSettings: "'opsz' 14",
                        }}
                      >
                        Phone Number*
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Select Your Number"
                        required
                        type="tel"
                        value={bookingFormData.phoneNumber}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:before': {
                            borderBottom: '1px solid #1c1c1c',
                          },
                          '& .MuiInput-underline:after': {
                            borderBottom: '1px solid #1c1c1c',
                          },
                          '& .MuiInput-underline:hover:before': {
                            borderBottom: '1px solid #1c1c1c',
                          },
                          '& .MuiInputBase-input': {
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: 1.2,
                            color: '#1c1c1c',
                            paddingBottom: '5.193px',
                          },
                        }}
                      />
                    </Box>

                    {/* Email */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '16px',
                          fontWeight: 600,
                          lineHeight: 1.2,
                          color: '#1c1c1c',
                          mb: '15.578px',
                          fontVariationSettings: "'opsz' 14",
                        }}
                      >
                        Email
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Select Your Email"
                        type="email"
                        value={bookingFormData.email}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, email: e.target.value }))}
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:before': {
                            borderBottom: '1px solid #1c1c1c',
                          },
                          '& .MuiInput-underline:after': {
                            borderBottom: '1px solid #1c1c1c',
                          },
                          '& .MuiInput-underline:hover:before': {
                            borderBottom: '1px solid #1c1c1c',
                          },
                          '& .MuiInputBase-input': {
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: 1.2,
                            color: '#1c1c1c',
                            paddingBottom: '5.193px',
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Property Name (Non-editable) */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '16px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        color: '#1c1c1c',
                        mb: '5px',
                        fontVariationSettings: "'opsz' 14",
                      }}
                    >
                      Property Name
                    </Typography>
                    <TextField
                      fullWidth
                      value={propertyData?.title || ''}
                      disabled
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:before': {
                          borderBottom: '1px solid #1c1c1c',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottom: '1px solid #1c1c1c',
                        },
                        '& .MuiInput-underline:hover:before': {
                          borderBottom: '1px solid #1c1c1c',
                        },
                        '& .MuiInputBase-input': {
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: 1.2,
                          color: '#1c1c1c',
                          paddingBottom: '5px',
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#1c1c1c',
                          opacity: 1,
                        },
                      }}
                    />
                  </Box>

                  {/* Project Details */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '16px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        color: '#1c1c1c',
                        mb: '5px',
                        fontVariationSettings: "'opsz' 14",
                      }}
                    >
                      Your Query*
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter your query"
                      required
                      multiline
                      rows={2}
                      value={bookingFormData.query}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, query: e.target.value }))}
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:before': {
                          borderBottom: '1px solid #1c1c1c',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottom: '1px solid #1c1c1c',
                        },
                        '& .MuiInput-underline:hover:before': {
                          borderBottom: '1px solid #1c1c1c',
                        },
                        '& .MuiInputBase-input': {
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: 1.2,
                          color: '#1c1c1c',
                          paddingBottom: '5px',
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Success/Error Messages */}
                {submitSuccess && (
                  <Alert severity="success" sx={{ width: '100%' }}>
                    Thank you for your query! We will contact you soon.
                  </Alert>
                )}
                {submitError && (
                  <Alert severity="error" sx={{ width: '100%' }}>
                    {submitError}
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    bgcolor: '#17badf',
                    color: 'white',
                    height: '45px',
                    px: '24px',
                    py: '12px',
                    borderRadius: '4px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: 1.2,
                    textTransform: 'capitalize',
                    fontVariationSettings: "'opsz' 14",
                    '&:hover': {
                      bgcolor: '#00acc1',
                    },
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Box>

              {/* Download Buttons - Bottom Left */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '24px',
                  bottom: '24px',
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap',
                }}
              >
                {property.brochure && (
                  <Button
                    variant="outlined"
                    onClick={() => handleDownload(property.brochure, 'brochure.pdf')}
                    sx={{
                      borderColor: '#17badf',
                      color: '#17badf',
                      height: '45px',
                      px: '24px',
                      py: '12px',
                      borderRadius: '4px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '16px',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      textTransform: 'capitalize',
                      fontVariationSettings: "'opsz' 14",
                      '&:hover': {
                        borderColor: '#00acc1',
                        bgcolor: 'rgba(23, 186, 223, 0.04)',
                      },
                    }}
                  >
                    Download Broucher
                  </Button>
                )}
                {property.paymentSchedule && (
                  <Button
                    variant="outlined"
                    onClick={() => handleDownload(property.paymentSchedule, 'payment-schedule.pdf')}
                    sx={{
                      borderColor: '#17badf',
                      color: '#17badf',
                      height: '45px',
                      px: '24px',
                      py: '12px',
                      borderRadius: '4px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '16px',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      textTransform: 'capitalize',
                      fontVariationSettings: "'opsz' 14",
                      '&:hover': {
                        borderColor: '#00acc1',
                        bgcolor: 'rgba(23, 186, 223, 0.04)',
                      },
                    }}
                  >
                    Payment Schedule
                  </Button>
                )}
              </Box>
            </Paper>
          </Container>
        </Box>
    </Box>
  );
};

export default PropertyDetails;
