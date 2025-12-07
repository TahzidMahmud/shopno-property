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
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h6" sx={{ color: 'info.main', fontSize: '1.1rem' }}>{property.title}</Typography>
          <Box sx={{ bgcolor: '#f0f0f0', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.8rem' }}>
            {area}
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {property.full_address || location}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'info.main', mr: 1 }}>{status}:</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>{propertyType}</Typography>
          {bedrooms > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>• {bedrooms} Bedrooms</Typography>
          )}
          {bathrooms > 0 && (
            <Typography variant="body2" color="text.secondary">• {bathrooms} Bathroom</Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">Company Name:</Typography>
          <Box sx={{ bgcolor: '#f0f0f0', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.8rem' }}>
            {companyName}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
