import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, Card, CardMedia, CardContent, Paper, CircularProgress, Avatar } from '@mui/material';
import { ArrowForward, Star } from '@mui/icons-material';
import { aboutPageService } from '../services/aboutPageService';
import { AboutPageData } from '../types/AboutPage';
import PartnersSection from '../components/PartnersSection';

const BULLET = '\u2022'; // Unicode bullet point character

const About: React.FC = () => {
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const data = await aboutPageService.getAll();
      setPageData(data);
    } catch (error) {
      console.error('Error loading about page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '/assets/house1.jpg';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const handleNextTestimonial = () => {
    if (pageData?.testimonials && pageData.testimonials.length > 0) {
      setCurrentTestimonialIndex((prev) => (prev + 1) % pageData.testimonials.length);
    }
  };

  const handlePrevTestimonial = () => {
    if (pageData?.testimonials && pageData.testimonials.length > 0) {
      setCurrentTestimonialIndex((prev) => (prev - 1 + pageData.testimonials.length) % pageData.testimonials.length);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const settings = pageData?.settings || {};
  const projects = pageData?.projects || [];
  const teamMembers = pageData?.team_members || [];
  const testimonials = pageData?.testimonials || [];

  // Default values
  const heroTitle = settings.hero_title || 'About Us';
  const heroBackground = getImageUrl(settings.hero_background_image);
  const visionTitle = settings.vision_title || 'Where Vision Meets Value';
  const visionDescription = settings.vision_description || 'Welcome to Shopno Property – your trusted real estate partner. We make it easy to find and secure the perfect property, whether you\'re looking for a home, land, or investment opportunity. Enjoy a seamless experience with verified listings, expert guidance, and dedicated support every step of the way.';
  const visionImage = getImageUrl(settings.vision_image);
  const projectsTitle = settings.projects_title || 'Discover Our Signature Projects';
  const projectsSubtitle = settings.projects_subtitle || 'From residential to commercial developments, each project reflects our commitment to quality and trust.';
  const teamTitle = settings.team_title || 'Our Professional Team Member';
  const chairmanName = settings.chairman_name || 'MD. Sirajul Islam';
  const chairmanPosition = settings.chairman_position || 'MANAGING DIRECTOR';
  const chairmanImage = getImageUrl(settings.chairman_image);
  const chairmanMessage = settings.chairman_message || 'Our mission at Shopno Property has always been to build more than just structures; we build communities and futures. It is with this commitment that we proudly present Matribhumi City, a landmark project designed to be a true sanctuary for your family near Dhaka. This project is a testament to our dedication to quality, innovation, and your trust in us. We are deeply grateful for your continued support and look forward to building a future of shared success with you.';
  const testimonialsTitle = settings.testimonials_title || 'Hear What Our Client Say';
  const testimonialsSubtitle = settings.testimonials_subtitle || 'Hear from our clients about finding their dream homes, seamless property deals.';

  // Statistics
  const stats = [
    { value: settings.stat_projects || '50+', label: 'Project Completed' },
    { value: settings.stat_customers || '48+', label: 'Satisfied Customers' },
    { value: settings.stat_success_rate || '45%', label: 'Success Rate' },
    { value: settings.stat_team || '5+', label: 'Expert Team Members' },
  ];

  const currentTestimonial = testimonials[currentTestimonialIndex] || testimonials[0];

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

      {/* Where Vision Meets Value Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                image={visionImage}
                alt="Vision Image"
                sx={{ width: '100%', height: { xs: 300, md: 400 }, objectFit: 'cover', borderRadius: 2 }}
              />
              {settings.award_badge && (
                <Paper
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: 1,
                    boxShadow: 3,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    {settings.award_badge}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="overline" sx={{ color: '#00bcd4', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.75rem' }}}>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <Box component="span">{BULLET}</Box>
                  <Box component="span">About The Shopno</Box>
                  <Box component="span">{BULLET}</Box>
                </Box>
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                }}
              >
              {visionTitle.split(' ').map((word, index, arr) =>
                index === arr.length - 1 ? (
                  <Box key={index} component="span" sx={{ bgcolor: '#00bcd4', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, ml: 1 }}>
                    {word}
                  </Box>
                ) : (
                  <React.Fragment key={index}>{word} </React.Fragment>
                )
              )}
            </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              {visionDescription}
            </Typography>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              sx={{
                color: '#00bcd4',
                borderColor: '#00bcd4',
                textTransform: 'none',
                fontSize: { xs: '0.9rem', md: '1rem' },
                '&:hover': {
                  borderColor: '#00acc1',
                  backgroundColor: 'rgba(0, 188, 212, 0.04)',
                },
              }}
            >
              Learn More
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Statistics Section */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" component="div" sx={{ fontWeight: 'bold', color: '#00bcd4', mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Discover Our Signature Projects Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: '#00bcd4', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="span">{BULLET}</Box>
              <Box component="span">Expertise Reflected in Every Project</Box>
              <Box component="span">{BULLET}</Box>
            </Box>
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mt: 2, gap: 2 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
              }}
            >
              {projectsTitle.split(' ').map((word, index, arr) =>
                index === arr.length - 1 ? (
                  <Box key={index} component="span" sx={{ bgcolor: '#00bcd4', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, ml: 1 }}>
                    {word}
                  </Box>
                ) : (
                  <React.Fragment key={index}>{word} </React.Fragment>
                )
              )}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: { xs: '100%', md: 400 }, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              {projectsSubtitle}
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {projects.slice(0, 4).map((project) => (
            <Grid item xs={12} sm={6} md={3} key={project.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(project.image)}
                  alt={project.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    {project.title}
                  </Typography>
                  {project.subtitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                      {project.subtitle}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Our Professional Team Member Section */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 4, gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#00bcd4', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <Box component="span">{BULLET}</Box>
                  <Box component="span">Our Team</Box>
                  <Box component="span">{BULLET}</Box>
                </Box>
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mt: 1,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                }}
              >
                {teamTitle.split(' ').map((word, index, arr) =>
                  index === arr.length - 1 ? (
                    <Box key={index} component="span" sx={{ bgcolor: '#00bcd4', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, ml: 1 }}>
                      {word}
                    </Box>
                  ) : (
                    <React.Fragment key={index}>{word} </React.Fragment>
                  )
                )}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              sx={{
                color: '#00bcd4',
                borderColor: '#00bcd4',
                textTransform: 'none',
                fontSize: { xs: '0.9rem', md: '1rem' },
                '&:hover': {
                  borderColor: '#00acc1',
                  backgroundColor: 'rgba(0, 188, 212, 0.04)',
                },
              }}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {teamMembers.slice(0, 4).map((member) => (
              <Grid item xs={12} sm={6} md={3} key={member.id}>
                <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', textAlign: 'center' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={getImageUrl(member.image)}
                    alt={member.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                      {member.position}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Message From The Chairman Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
          <Grid item xs={12} md={4}>
            <Avatar
              src={chairmanImage}
              alt={chairmanName}
              sx={{
                width: { xs: 200, md: 300 },
                height: { xs: 200, md: 300 },
                mx: 'auto',
                display: 'block',
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="overline" sx={{ color: '#00bcd4', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              A MESSAGE FROM THE CHAIRMAN
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3, mt: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Dear Esteemed Clients And Stakeholders,
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              {chairmanMessage}
            </Typography>
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                {chairmanPosition}
              </Typography>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mt: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                {chairmanName}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Hear What Our Client Say Section */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 4, gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#00bcd4', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <Box component="span">{BULLET}</Box>
                  <Box component="span">Our Testimonial</Box>
                  <Box component="span">{BULLET}</Box>
                </Box>
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mt: 1,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                }}
              >
                {testimonialsTitle.split(' ').map((word, index, arr) =>
                  index === arr.length - 1 ? (
                    <Box key={index} component="span" sx={{ bgcolor: '#00bcd4', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, ml: 1 }}>
                      {word}
                    </Box>
                  ) : (
                    <React.Fragment key={index}>{word} </React.Fragment>
                  )
                )}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: { xs: '100%', md: 400 }, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              {testimonialsSubtitle}
            </Typography>
          </Box>
          {currentTestimonial && (
            <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: { xs: 3, md: 4 }, position: 'relative' }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                      <Star key={i} sx={{ color: '#ffc107', fontSize: { xs: 20, md: 24 } }} />
                    ))}
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontSize: 60, color: '#00bcd4', opacity: 0.3, position: 'absolute', top: 20, left: 20, lineHeight: 1 }}>
                    "
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: { xs: '0.9rem', md: '1rem' }, pl: 4 }}>
                    {currentTestimonial.quote}
                  </Typography>
                  <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      {currentTestimonial.author_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                      {currentTestimonial.author_position}
                      {currentTestimonial.author_company && `, ${currentTestimonial.author_company}`}
                    </Typography>
                  </Box>
                  {testimonials.length > 1 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={handlePrevTestimonial}
                        sx={{ minWidth: 40, height: 40 }}
                      >
                        ←
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleNextTestimonial}
                        sx={{ minWidth: 40, height: 40 }}
                      >
                        →
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
              {currentTestimonial.image && (
                <Grid item xs={12} md={4}>
                  <CardMedia
                    component="img"
                    image={getImageUrl(currentTestimonial.image)}
                    alt="Testimonial"
                    sx={{ width: '100%', height: { xs: 250, md: 300 }, objectFit: 'cover', borderRadius: 2 }}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Partners Section */}
      <PartnersSection />
    </Box>
  );
};

export default About;

