import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { blogPostService } from '../services/homePageService';
import { BlogPost } from '../types/HomePage';

export default function BlogSection() {
  const navigate = useNavigate();
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
      <Box sx={{ py: '4rem', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <Box sx={{
      py: { xs: '3rem', md: '4rem' },
      px: { xs: 2, md: '120px' },
      maxWidth: 'lg',
      mx: 'auto',
      bgcolor: '#f8fdff'
    }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        mb: { xs: 3, md: '60px' },
        gap: { xs: 2, md: 0 }
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: { xs: '1', md: '0 0 auto' }, maxWidth: { xs: '100%', md: '287.945px' } }}>
          {/* Blog Label */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '7.5px' }}>
            <Box sx={{
              width: '12px',
              height: '12px',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: '#411f57',
            }} />
            <Typography sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: 1.2,
              color: '#411f57'
            }}>
              Blog
            </Typography>
            <Box sx={{
              width: '12px',
              height: '12px',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: '#411f57',
            }} />
          </Box>

          {/* Title with Blog Badge */}
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: { xs: '30px', md: '40px' },
              lineHeight: 1.3,
              color: '#272222',
              textTransform: 'capitalize',
              display: 'inline-block',
            }}>
              Read Our{' '}
            </Typography>
            <Box sx={{
              display: 'inline-block',
              bgcolor: '#17badf',
              color: '#fafafa',
              px: '14px',
              py: '10px',
              borderRadius: '4px',
              transform: 'rotate(4.4deg)',
              ml: '4px',
            }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: { xs: '28px', md: '32px' },
                lineHeight: 1.2,
                color: '#fafafa',
              }}>
                Blog
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* View All Button */}
        <Button
          variant="outlined"
          onClick={() => navigate('/blogs')}
          sx={{
            border: '1.5px solid #17badf',
            color: '#17badf',
            bgcolor: 'transparent',
            borderRadius: '4px',
            px: '24px',
            py: '12px',
            height: '50px',
            textTransform: 'none',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: { xs: '16px', md: '20px' },
            lineHeight: 1.2,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            '&:hover': {
              bgcolor: 'rgba(23, 186, 223, 0.04)',
              borderColor: '#17badf',
            },
            position: 'relative',
          }}
        >
          View All
          <Box
            component="img"
            src="/assets/icons/arrow-up-right.svg"
            alt="arrow"
            sx={{
              width: '20.714px',
              height: '20.714px',
              transform: 'rotate(2.085deg)',
            }}
          />
        </Button>
      </Box>

      {/* Blog Posts Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: { xs: 2, md: '21px' },
      }}>
        {posts.map((post, index) => (
          <Box
            key={post.id}
            onClick={() => post.id && navigate(`/blogs/${post.id}`)}
            sx={{
              bgcolor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: index === 1
                ? '0px 4px 12px 0px rgba(0,0,0,0.25)'
                : '0px 1px 10px 0px rgba(0,0,0,0.25)',
              height: { xs: 'auto', md: '469.286px' },
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.3)',
              },
            }}
          >
            {/* Image */}
            <Box sx={{
              width: '100%',
              height: { xs: '200px', md: '257.143px' },
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Box
                component="img"
                src={getImageUrl(post.image)}
                alt={post.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                }}
              />
            </Box>

            {/* Content */}
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: { xs: '16px', md: '21.43px' },
            }}>
              <Box>
                {/* Date */}
                <Typography sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: { xs: '13px', md: '15px' },
                  lineHeight: 1.2,
                  color: '#959ead',
                  mb: { xs: 1, md: '10px' },
                }}>
                  {formatDate(post.published_date)}
                </Typography>

                {/* Title */}
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: { xs: '18px', md: '24px' },
                  lineHeight: 1.3,
                  color: '#183b56',
                  mb: { xs: 1.5, md: '14px' },
                  whiteSpace: 'pre-wrap',
                }}>
                  {post.title}
                </Typography>

                {/* Content/Description */}
                {post.content && (
                  <Typography sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.5,
                    color: '#737373',
                    mb: { xs: 2, md: '20px' },
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                    {post.content.replace(/<[^>]*>/g, '').length > 150 ? '...' : ''}
                  </Typography>
                )}
              </Box>

              {/* Read More Link */}
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  if (post.id) navigate(`/blogs/${post.id}`);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#17badf',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                <Typography sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: { xs: '13px', md: '15px' },
                  lineHeight: 1.2,
                  color: '#17badf',
                }}>
                  READ MORE
                </Typography>
                <Box
                  component="img"
                  src="/assets/icons/arrow-right-blog.svg"
                  alt="arrow"
                  sx={{
                    width: { xs: '14px', md: '16px' },
                    height: { xs: '19px', md: '22px' },
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
