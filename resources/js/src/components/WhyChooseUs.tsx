import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Button, CircularProgress, CardMedia } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { whyChooseUsFeatureService } from '../services/homePageService';
import { WhyChooseUsFeature } from '../types/HomePage';
import { getYouTubeEmbedUrl, extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../utils/youtube';

// Icon mapping to Figma SVG files
const iconMap: Record<string, string> = {
  CameraAlt: '/assets/icons/medical-kit.svg',
  MedicalKit: '/assets/icons/medical-kit.svg',
  Chair: '/assets/icons/sofa.svg',
  Sofa: '/assets/icons/sofa.svg',
  Description: '/assets/icons/document-add.svg',
  DocumentAdd: '/assets/icons/document-add.svg',
  AccessAlarm: '/assets/icons/alarm.svg',
  Alarm: '/assets/icons/alarm.svg',
};

// Icon component that renders SVG with proper color
const FeatureIcon: React.FC<{ iconName: string; isActive: boolean }> = ({ iconName, isActive }) => {
  const iconPath = iconMap[iconName] || iconMap['CameraAlt'];

  return (
    <Box
      component="img"
      src={iconPath}
      alt={iconName}
      sx={{
        width: '32px',
        height: '32px',
        // Active: white icon, Inactive: #4d4d4d (dark gray)
        filter: isActive
          ? 'brightness(0) invert(1)' // White
          : 'brightness(0) saturate(100%) invert(30%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)', // #4d4d4d
        objectFit: 'contain',
      }}
    />
  );
};

export default function WhyChooseUs() {
  const navigate = useNavigate();
  const [features, setFeatures] = useState<WhyChooseUsFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const featuresData = await whyChooseUsFeatureService.getAll();

      const sortedFeatures = featuresData.sort((a, b) => a.order - b.order);
      setFeatures(sortedFeatures);

      // Set first active feature or first feature if none are active
      const firstActive = sortedFeatures.find(f => f.is_active);
      if (firstActive) {
        setActiveFeature(firstActive.id!);
      } else if (sortedFeatures.length > 0) {
        setActiveFeature(sortedFeatures[0].id!);
      }
    } catch (error) {
      console.error('Error loading Why Choose Us data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string): string => {
    if (!path) return 'https://via.placeholder.com/600x400?text=Why+Choose+Us+Image';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  if (loading) {
    return (
      <Box sx={{ py: '4rem', display: 'flex', justifyContent: 'center', bgcolor: '#f8fdff' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: '4rem', px: { xs: 2, md: 5 }, maxWidth: 'lg', mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        mb: { xs: 3, md: 4 },
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 0 }
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: { xs: '100%', md: '356px' } }}>
          {/* Our Approach Label */}
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
              Our Approach
            </Typography>
            <Box sx={{
              width: '12px',
              height: '12px',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: '#411f57',
            }} />
          </Box>

          {/* Title with Property Badge */}
          <Box sx={{ position: 'relative', display: 'inline-block', width: { xs: '100%', md: '356px' } }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: { xs: '32px', md: '40px' },
              lineHeight: 1.3,
              color: '#272222',
              textTransform: 'capitalize',
              display: 'inline-block',
            }}>
              Why Choose Us Shopno
            </Typography>
            <Box sx={{
              position: 'absolute',
              left: { xs: '0px', md: '157.16px' },
              top: { xs: '40px', md: '48.8px' },
              bgcolor: '#17badf',
              color: '#fafafa',
              px: '14px',
              py: '10px',
              borderRadius: '4px',
              transform: 'rotate(4.4deg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '42px',
              minWidth: '166.739px'
            }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: '32px',
                lineHeight: 1.2,
                color: '#fafafa',
                whiteSpace: 'nowrap'
              }}>
                Property
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Description Text */}
        <Typography sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: '18px',
          lineHeight: 1.5,
          color: '#737373',
          width: { xs: '100%', md: '419px' },
          textAlign: { xs: 'left', md: 'right' }
        }}>
          Explore the premier UK property hub to discover a range of houses and flats for sale or rent.
        </Typography>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Box sx={{
        display: 'flex',
        gap: { xs: 3, md: '48px' },
        alignItems: 'flex-start',
        flexDirection: { xs: 'column', md: 'row' },
        mb: 4
      }}>
        {/* Left Column - Features */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          flex: { xs: '1 1 100%', md: '0 0 48%' },
          width: { xs: '100%', md: 'auto' }
        }}>
          {features.map((feature) => {
            const isActive = activeFeature === feature.id;

            return (
              <Box
                key={feature.id}
                onClick={() => {
                  setActiveFeature(feature.id!);
                  setVideoPlaying(false);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  px: '20px',
                  py: '16px',
                  borderRadius: '4px',
                  bgcolor: isActive ? '#17badf' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 2,
                  },
                }}
              >
                {/* Icon Box */}
                <Box sx={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '2px',
                  bgcolor: isActive ? '#0d90ad' : '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <FeatureIcon iconName={feature.icon_name} isActive={isActive} />
                </Box>

                {/* Text Content */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  width: '435px',
                  flex: 1
                }}>
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '20px',
                    lineHeight: 1.2,
                    color: isActive ? 'white' : '#17181a'
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: '18px',
                    lineHeight: 1.5,
                    color: isActive ? 'white' : '#666b6f',
                    width: { xs: '100%', md: '435px' }
                  }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Right Column - Video */}
        <Box sx={{
            flex: { xs: '1 1 100%', md: '0 0 48%' },
            width: { xs: '100%', md: 'auto' }
        }}>
          {(() => {
            const activeFeatureData = features.find(f => f.id === activeFeature);
            const videoUrl = activeFeatureData?.video_url || null;
            const videoThumbnail: string = activeFeatureData?.video_thumbnail
              ? getImageUrl(activeFeatureData.video_thumbnail)
              : (videoUrl && extractYouTubeVideoId(videoUrl)
                ? (getYouTubeThumbnailUrl(videoUrl, 'high') || 'https://via.placeholder.com/605x564?text=Why+Choose+Us+Image')
                : 'https://via.placeholder.com/605x564?text=Why+Choose+Us+Image');

            if (!videoUrl || !extractYouTubeVideoId(videoUrl)) {
              return (
                <Box sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 300, md: '564px' },
                  borderRadius: '4px',
                  overflow: 'hidden',
                  bgcolor: 'rgba(0,0,0,0.04)',
                }}>
                  <CardMedia
                    component="img"
                    image={videoThumbnail}
                    alt="Why Choose Us"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              );
            }

            return (
              <Box sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 300, md: '564px' },
                borderRadius: '4px',
                overflow: 'hidden',
                bgcolor: 'rgba(0,0,0,0.04)',
              }}>
                {!videoPlaying ? (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                    onClick={() => setVideoPlaying(true)}
                  >
                    <CardMedia
                      component="img"
                      image={videoThumbnail}
                      alt="Video Thumbnail"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Play Button with Concentric Circles */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                      }}
                    >
                      {/* Outer Circle */}
                      <Box sx={{
                        bgcolor: 'rgba(255,255,255,0.3)',
                        borderRadius: '100px',
                        p: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {/* Middle Circle */}
                        <Box sx={{
                          bgcolor: 'rgba(255,255,255,0.4)',
                          borderRadius: '100px',
                          p: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {/* Inner Circle with Play Icon */}
                          <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.4)',
                            borderRadius: '100px',
                            width: '100px',
                            height: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <PlayArrowIcon sx={{
                              fontSize: '40px',
                              color: 'white',
                              ml: 0.5
                            }} />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
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
                      src={`${getYouTubeEmbedUrl(videoUrl)}?autoplay=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Why Choose Us Video"
                    />
                  </Box>
                )}
              </Box>
            );
          })()}
        </Box>
      </Box>

      {/* Learn More Button - Centered */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: '#17badf',
            borderWidth: '1px',
            borderStyle: 'solid',
            color: '#17badf',
            textTransform: 'none',
            px: '24px',
            py: '12px',
            fontSize: '20px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            lineHeight: 1.2,
            borderRadius: '4px',
            position: 'relative',
            '&:hover': {
              borderColor: '#17badf',
              bgcolor: 'transparent',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-1px',
              left: '-1px',
              width: '2px',
              height: '0',
            }
          }}
          endIcon={
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20.714px',
              height: '20.714px',
              transform: 'rotate(2.085deg)'
            }}>
              <ArrowOutwardIcon sx={{ fontSize: '20px', color: '#17badf' }} />
            </Box>
          }
          onClick={() => navigate('/about')}
        >
          Learn More
        </Button>
      </Box>
    </Box>
  );
}
