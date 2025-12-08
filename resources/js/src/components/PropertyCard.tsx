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
      sx={{ border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: 'none', cursor: 'pointer' }}
      onClick={() => property.id && onOpen(property.id)}
    >
      <CardMedia
        component="img"
        height="160"
        image={imageUrl}
        alt={property.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ color: '#212121', fontSize: '1.1rem', fontWeight: 'bold', flex: 1 }}>{property.title}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.875rem' }}>
          {property.full_address || location}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
          {bedrooms > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>{bedrooms} Bedrooms</Typography>
          )}
          {bathrooms > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>• {bathrooms} Bathroom</Typography>
          )}
          {property.total_parking && property.total_parking > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>• {property.total_parking} Garage</Typography>
          )}
          {property.area && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>• {property.area} Sqft</Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>{companyName}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
