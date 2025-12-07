import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { blogPostService } from '../services/homePageService';
import { BlogPost } from '../types/HomePage';

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogPostService.getAll();
      const publishedPosts = data
        .filter(post => post.is_published)
        .sort((a, b) => a.order - b.order)
        .slice(0, 3); // Show only first 3
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return '/assets/house1.jpg';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (posts.length === 0) {
    return null;
  }

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
          {posts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(post.image)}
                  alt={post.title}
                  sx={{ width: '100%', height: 192, objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ color: 'grey.500', mb: 1 }}>
                    {formatDate(post.published_date)}
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
