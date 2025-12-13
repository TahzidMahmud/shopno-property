import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, CircularProgress, Alert, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { blogPostService } from '../services/homePageService';
import { BlogPost } from '../types/HomePage';

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Blog post ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await blogPostService.getById(parseInt(id));
        setPost(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const getImageUrl = (path: string | undefined) => {
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
      <Box sx={{ py: '4rem', display: 'flex', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="lg" sx={{ py: '4rem' }}>
        <Alert severity="error">{error || 'Blog post not found'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/blogs')}
          sx={{ mt: 2 }}
        >
          Back to Blogs
        </Button>
      </Container>
    );
  }

  return (
      <Box sx={{ py: { xs: '2rem', md: '4rem' }, minHeight: '60vh' }}>
        <Container maxWidth="lg">
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/blogs')}
            sx={{
              mb: 3,
              color: '#17badf',
              '&:hover': {
                backgroundColor: 'rgba(23, 186, 223, 0.1)',
              },
            }}
          >
            Back to Blogs
          </Button>

          {/* Blog Post Content */}
          <Box sx={{ bgcolor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0px 1px 10px 0px rgba(0,0,0,0.25)' }}>
            {/* Featured Image */}
            <Box
              sx={{
                width: '100%',
                height: { xs: '300px', md: '500px' },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={getImageUrl(post.image)}
                alt={post.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>

            {/* Content */}
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              {/* Date */}
              <Typography
                sx={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: { xs: '14px', md: '15px' },
                  color: '#959ead',
                  mb: 2,
                }}
              >
                {formatDate(post.published_date)}
              </Typography>

              {/* Title */}
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: { xs: '28px', md: '36px' },
                  color: '#183b56',
                  mb: 3,
                  lineHeight: 1.3,
                }}
              >
                {post.title}
              </Typography>

              {/* Content */}
              {post.content && (
                <Box
                  sx={{
                    '& p': {
                      fontFamily: '"Inter", sans-serif',
                      fontSize: { xs: '16px', md: '18px' },
                      color: '#4d4d4d',
                      lineHeight: 1.8,
                      mb: 2,
                    },
                    '& h2, & h3': {
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 600,
                      color: '#183b56',
                      mt: 3,
                      mb: 2,
                    },
                    '& h2': {
                      fontSize: { xs: '24px', md: '28px' },
                    },
                    '& h3': {
                      fontSize: { xs: '20px', md: '24px' },
                    },
                    '& ul, & ol': {
                      pl: 3,
                      mb: 2,
                    },
                    '& li': {
                      fontFamily: '"Inter", sans-serif',
                      fontSize: { xs: '16px', md: '18px' },
                      color: '#4d4d4d',
                      lineHeight: 1.8,
                      mb: 1,
                    },
                    '& img': {
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      my: 2,
                    },
                    '& a': {
                      color: '#17badf',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}

              {!post.content && (
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: { xs: '16px', md: '18px' },
                    color: '#4d4d4d',
                    lineHeight: 1.8,
                  }}
                >
                  No content available for this blog post.
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
  );
}

