import React from 'react'
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { Property } from '../types/Property'

type Props = {
  property: Property;
  onOpen: (id: number) => void;
}

const getImageUrl = (path: string | undefined) => {
  if (!path) return '/assets/house1.jpg'; // Fallback placeholder
  if (path.startsWith('http')) return path;
  return `/storage/${path}`;
};

export default function PropertyCard({ property, onOpen }: Props) {
  const imageUrl = getImageUrl(property.main_image);
  const area = property.area || 'N/A';
  const location = property.location || 'N/A';
  const propertyType = property.type || 'N/A';
  const bedrooms = property.bedrooms || 0;
  const bathrooms = property.bathrooms || 0;
  const companyName = property.company_name || 'N/A';
  const status = property.status || 'N/A';

  return (
    <Card
      sx={{ 
        bgcolor: 'white',
        borderRadius: '7.002px',
        boxShadow: '0px 1.751px 11.379px 0px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        p: { xs: '8px', md: '8.753px' },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.12)',
        }
      }}
      onClick={() => property.id && onOpen(property.id)}
    >
      {/* Image */}
      <Box sx={{
        width: '100%',
        height: { xs: '200px', sm: '240px', md: '280.963px' },
        borderRadius: '3.501px',
        overflow: 'hidden',
        mb: { xs: '10px', md: '10.503px' },
        position: 'relative'
      }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={property.title}
          sx={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </Box>

      <CardContent sx={{ 
        p: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: { xs: '12px', md: '14.004px' },
        flex: 1
      }}>
        {/* Title and Area Badge */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: '8px', md: '8.753px' }
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: { xs: '10px', md: '83.151px' }
          }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: { xs: '14px', md: '16.462px' },
              lineHeight: 1.2,
              color: '#282424',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1
            }}>
              {property.title}
            </Typography>
            {area && area !== 'N/A' && (
              <Box sx={{
                border: '0.875px solid #d7d6d6',
                borderRadius: '1.751px',
                px: { xs: '8px', md: '10.975px' },
                py: { xs: '3px', md: '4.573px' },
                height: { xs: '20px', md: '22.864px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: { xs: '8px', md: '9.146px' },
                  lineHeight: 1.2,
                  color: '#282424',
                  whiteSpace: 'nowrap'
                }}>
                  {area}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Address */}
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: { xs: '10px', md: '10.975px' },
            lineHeight: 1.5,
            color: '#a0a0a0'
          }}>
            {property.full_address || location}
          </Typography>
        </Box>

        {/* Divider */}
        <Box sx={{
          width: '100%',
          height: '0',
          borderTop: '0.875px solid #e0e0e0'
        }} />

        {/* Property Details */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: { xs: '10px', md: '12.254px' }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: { xs: '12px', md: '17.505px' },
            flexWrap: 'wrap'
          }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: { xs: '9px', md: '10.503px' },
              lineHeight: 1.2,
              color: { xs: '#4d4d4d', md: property.status === 'Under Construction' ? '#17badf' : '#4d4d4d' },
              whiteSpace: 'nowrap'
            }}>
              {status === 'Under Construction' ? 'Underdevelopment:' : 'Status:'}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: { xs: '8px', md: '12.254px' },
              flexWrap: 'wrap'
            }}>
              {propertyType && propertyType !== 'N/A' && (
                <>
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: '9px', md: '10.975px' },
                    lineHeight: 1.2,
                    color: '#8c8b8b',
                    whiteSpace: 'nowrap'
                  }}>
                    {propertyType}
                  </Typography>
                  {(bedrooms > 0 || bathrooms > 0) && (
                    <Box sx={{
                      width: { xs: '4px', md: '5.487px' },
                      height: { xs: '4px', md: '5.487px' },
                      borderRadius: '50%',
                      bgcolor: '#8c8b8b'
                    }} />
                  )}
                </>
              )}
              {bedrooms > 0 && (
                <>
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: '9px', md: '10.975px' },
                    lineHeight: 1.2,
                    color: '#8c8b8b',
                    whiteSpace: 'nowrap'
                  }}>
                    {bedrooms} Bedrooms
                  </Typography>
                  {bathrooms > 0 && (
                    <Box sx={{
                      width: { xs: '4px', md: '5.487px' },
                      height: { xs: '4px', md: '5.487px' },
                      borderRadius: '50%',
                      bgcolor: '#8c8b8b'
                    }} />
                  )}
                </>
              )}
              {bathrooms > 0 && (
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: { xs: '9px', md: '10.975px' },
                  lineHeight: 1.2,
                  color: '#8c8b8b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {bathrooms} Bathroom
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Company Name */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          height: { xs: '18px', md: '21.882px' },
          mt: 'auto'
        }}>
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: { xs: '9px', md: '10.503px' },
            lineHeight: 1.2,
            color: '#a0a0a0',
            whiteSpace: 'nowrap'
          }}>
            Company Name:
          </Typography>
          <Box sx={{
            bgcolor: '#f5f5f5',
            px: { xs: '8px', md: '10.503px' },
            py: { xs: '3px', md: '4.376px' },
            borderRadius: '2px'
          }}>
            <Typography sx={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              fontSize: { xs: '9px', md: '10.503px' },
              lineHeight: 1.2,
              color: '#474040',
              whiteSpace: 'nowrap'
            }}>
              {companyName}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
