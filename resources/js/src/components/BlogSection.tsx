import React from 'react';
import { Box, Typography, Grid, Button, Card, CardContent, CardMedia } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // Keep OpenInNewIcon for now, as it was in the original code.

export default function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      title: 'New Apartment Nice in the Best Canadian Cities',
      date: 'October 30, 2024',
      image: '/assets/house1.jpg',
    },
    {
      id: 2,
      title: 'New Apartment Nice in the Best Canadian Cities',
      date: 'October 30, 2024',
      image: '/assets/house2.jpg',
    },
    {
      id: 3,
      title: 'New Apartment Nice in the Best Canadian Cities',
      date: 'October 30, 2024',
      image: '/assets/house3.jpg',
    },
  ];

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4, lg: 8 }, backgroundColor: 'grey.50' }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: 8, height: 8, backgroundColor: 'purple.600', transform: 'rotate(45deg)', mr: 0.5 }} />
          <Typography variant="body2" sx={{ color: 'purple.600', fontWeight: 'semibold' }}>
            Blog
          </Typography>
          <Box sx={{ width: 8, height: 8, backgroundColor: 'purple.600', transform: 'rotate(45deg)', ml: 0.5 }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
            Read Our{' '}
            <Box component="span" sx={{ backgroundColor: 'info.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, transform: 'rotate(-6deg)', display: 'inline-block' }}>
              Blog
            </Box>
          </Typography>
          <Button
            variant="outlined"
            sx={{ color: 'info.main', borderColor: 'info.main', '&:hover': { backgroundColor: 'info.50' } }}
            endIcon={<ArrowForwardIcon />}
          >
            View All
          </Button>
        </Box>

        {/* Blog Posts Grid */}
        <Grid container spacing={4}>
          {blogPosts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                  sx={{ width: '100%', height: 192, objectFit: 'cover' }} // h-48 is 192px
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ color: 'grey.500', mb: 1 }}>
                    {post.date}
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'semibold', color: 'grey.800', mb: 2 }}>
                    {post.title}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ color: 'info.main', fontWeight: 'semibold', '&:hover': { textDecoration: 'underline' } }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    READ MORE
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
