import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, IconButton, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ArrowBack, ArrowForward, ArrowOutward, PlayArrow } from '@mui/icons-material'; // Import new icons
import Footer from '../components/Footer';

const PropertyDetails: React.FC = () => {
  const property = {
    title: 'The Cayantal',
    mainImage: '/assets/house1.jpg', // Placeholder image
    description: 'Get into the most profitable investment industry and turn your sale money into profits.',
    details: [
      { label: 'Status', value: 'Under Construction' },
      { label: 'Area', value: '1000 - 1500 Sq Ft' },
      { label: 'Location', value: 'New York, USA' },
      { label: 'Type', value: 'Apartment' },
      { label: 'Total Floor', value: '06' },
      { label: 'Total Flat', value: '10' },
      { label: 'Flat Size', value: '100 - 150 Sq Ft' },
      { label: 'Total Parking', value: '10' },
      { label: 'Price Range', value: '৳ 80 LACH - ৳ 90 LACH' },
    ],
    galleryImages: [
      '/assets/house2.jpg', // Placeholder image
      '/assets/house3.jpg', // Placeholder image
    ],
    layoutImages: [
      '/assets/layout1.html', // Placeholder image for layout
      '/assets/layout2.html', // Another placeholder
    ],
    galleryImagesGrid: [ // New array for gallery grid
      '/assets/house1.jpg',
      '/assets/house2.jpg',
      '/assets/house3.jpg',
      '/assets/gallery_img4.html',
      '/assets/gallery_img5.html',
      '/assets/gallery_img6.html',
    ],
    videoThumbnail: '/assets/video_thumbnail.html', // Placeholder for video thumbnail
    facilities: [
      { icon: 'A', name: 'Surveillance System' }, // Placeholder icons
      { icon: 'B', name: '24x7 Security' },
      { icon: 'C', name: 'Firefighting System' },
      { icon: 'D', name: 'Swimming Pool' },
      { icon: 'E', name: 'Children\'s Play Area' },
      { icon: 'F', name: 'Landscape Garden' },
      { icon: 'G', name: 'Community Hall' },
      { icon: 'H', name: 'Fitness Center' },
    ],
  };

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [currentLayoutImageIndex, setCurrentLayoutImageIndex] = React.useState(0); // New state for layout carousel

  // State for Installment Calculation
  const [propertyName, setPropertyName] = React.useState('Shopno Property House');
  const [propertyPrice, setPropertyPrice] = React.useState(5000000);
  const [loanPeriod, setLoanPeriod] = React.useState(5); // Years
  const [downPaymentPercentage, setDownPaymentPercentage] = React.useState(20); // Percentage
  const [monthlyInstallment, setMonthlyInstallment] = React.useState(0);
  const [dueAmount, setDueAmount] = React.useState(0);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? property.galleryImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === property.galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousLayoutImage = () => {
    setCurrentLayoutImageIndex((prevIndex) =>
      prevIndex === 0 ? property.layoutImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextLayoutImage = () => {
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

  React.useEffect(() => {
    handleCalculate();
  }, [propertyPrice, loanPeriod, downPaymentPercentage]);

  const isFirstSlide = currentImageIndex === 0;
  const isLastSlide = currentImageIndex === property.galleryImages.length - 1;

  const isFirstLayoutSlide = currentLayoutImageIndex === 0;
  const isLastLayoutSlide = currentLayoutImageIndex === property.layoutImages.length - 1;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url(${property.mainImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
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
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
          },
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', zIndex: 1 }}>
          {property.title}
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Why Invest Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
            <Typography variant="subtitle2" color="text.secondary">Property details</Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Why Should You Invest In This <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: 1, py: 0.5, borderRadius: 1 }}>Property</Box>
              </Typography>
              <Box sx={{ position: 'relative', width: '100%', height: '350px', borderRadius: 2 }}> {/* New wrapper Box for image and arrows */}
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
                    left: -15, // Position outside the image
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: isFirstSlide ? 'white' : 'primary.main',
                    color: isFirstSlide ? 'black' : 'white',
                    border: isFirstSlide ? '1px solid #e0e0e0' : 'none',
                    boxShadow: isFirstSlide ? 1 : 'none',
                    borderRadius: '8px', // Rounded rectangle
                    '&:hover': { bgcolor: isFirstSlide ? '#f0f0f0' : 'primary.dark' },
                  }}
                  onClick={handlePreviousImage}
                >
                  <ArrowBack />
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: -15, // Position outside the image
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: isLastSlide ? 'white' : 'primary.main',
                    color: isLastSlide ? 'black' : 'white',
                    border: isLastSlide ? '1px solid #e0e0e0' : 'none',
                    boxShadow: isLastSlide ? 1 : 'none',
                    borderRadius: '8px', // Rounded rectangle
                    '&:hover': { bgcolor: isLastSlide ? '#f0f0f0' : 'primary.dark' },
                  }}
                  onClick={handleNextImage}
                >
                  <ArrowForward />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {property.description}
              </Typography>
              <Grid container spacing={2}>
                {property.details.map((detail, index) => (
                  <Grid item xs={12} key={index}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{detail.label}: <Box component="span" sx={{ fontWeight: 'normal', color: 'text.secondary' }}>{detail.value}</Box></Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* Facilities Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">Our Facilities</Typography>
          </Box>
          <Grid container spacing={4}> {/* Use Grid for layout of text and cards container */}
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
                Explore <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: 1, py: 0.5, borderRadius: 1 }}>Our</Box> Facilities
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <Typography variant="subtitle2" color="text.secondary" align="right" sx={{ mb: 4 }}>
                Shopno Property is Innovating the Concept of Living
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ bgcolor: '#3f2e5b', borderRadius: 2, p: 4 }}> {/* Dark purple container for cards */}
            <Grid container spacing={3}>
              {property.facilities.map((facility, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ textAlign: 'center', p: 3, boxShadow: 3, borderRadius: '8px', bgcolor: 'white' }}>
                    <CardContent>
                      <Box sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '8px',
                        bgcolor: 'primary.light', // Light blue background for icon
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: 'primary.main', // Icon color
                        fontSize: '2rem',
                        fontWeight: 'bold',
                      }}>
                        {facility.icon}
                      </Box>
                      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: 'black' }}>{facility.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Our Layout Section */}
        <Box sx={{ mt: 6, mb: 6, textAlign: 'center' }}> {/* Centered text */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}> {/* Centered dot and text */}
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
            <Typography variant="subtitle2" color="text.secondary">Gallery</Typography>
          </Box>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
            Our Layout
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', height: '500px', borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              image={property.layoutImages[currentLayoutImageIndex]}
              alt="Property Layout"
              sx={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 2 }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                left: -15, // Position outside the image
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'primary.main',
                color: 'white',
                border: 'none',
                boxShadow: 'none',
                borderRadius: '8px', // Rounded rectangle
                '&:hover': { bgcolor: 'primary.dark' },
              }}
              onClick={handlePreviousLayoutImage}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              sx={{
                position: 'absolute',
                right: -15, // Position outside the image
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'primary.main',
                color: 'white',
                border: 'none',
                boxShadow: 'none',
                borderRadius: '8px', // Rounded rectangle
                '&:hover': { bgcolor: 'primary.dark' },
              }}
              onClick={handleNextLayoutImage}
            >
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>

        {/* Explore Our Gallery Section */}
        <Box sx={{ mt: 6, mb: 6 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">Gallery</Typography>
              </Box>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
                Explore <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: 1, py: 0.5, borderRadius: 1 }}>Our</Box> Gallery
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="primary" endIcon={<ArrowOutward />}>
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
                  sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Video Tours Section */}
        <Box sx={{ mt: 6, mb: 6, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
            <Typography variant="subtitle2" color="text.secondary">Video</Typography>
          </Box>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
            Video Tours
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 800, height: 450, mx: 'auto', borderRadius: 2, overflow: 'hidden' }}>
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
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: '#3f2e5b', // Dark purple background
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&::before': { // Inner concentric circle
                  content: '""',
                  position: 'absolute',
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                },
                '&::after': { // Outer concentric circle
                  content: '""',
                  position: 'absolute',
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.1)',
                },
              }}
            >
              <PlayArrow sx={{ fontSize: 60, color: 'white', zIndex: 1 }} />
            </Box>
          </Box>
        </Box>

        {/* Installment Calculation Section */}
        <Box sx={{ mt: 6, mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
            Installment Calculation
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Property Name</InputLabel>
                  <Select
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value as string)}
                    label="Property Name"
                    sx={{ bgcolor: '#f0f0f0', borderRadius: 1 }}
                  >
                    <MenuItem value="Shopno Property House">Shopno Property House</MenuItem>
                    <MenuItem value="Another Property">Another Property</MenuItem>
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Down Payment</InputLabel>
                  <Select
                    value={downPaymentPercentage}
                    onChange={(e) => setDownPaymentPercentage(Number(e.target.value))}
                    label="Down Payment"
                    sx={{ bgcolor: '#f0f0f0', borderRadius: 1 }}
                  >
                    <MenuItem value={10}>10%</MenuItem>
                    <MenuItem value={20}>20%</MenuItem>
                    <MenuItem value={30}>30%</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleCalculate} sx={{ py: 1.5, borderRadius: 1 }}>
                  Calculate
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Monthly Installment</Typography>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', mb: 3 }}>BDT {monthlyInstallment.toLocaleString()}</Typography>
                  <Box sx={{ borderBottom: '1px solid #e0e0e0', mb: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Due Amount</Typography>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>BDT {dueAmount.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

    </Box>
  );
};

export default PropertyDetails;
