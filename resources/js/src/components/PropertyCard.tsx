import React from 'react'
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { Property } from '../types'

type Props = {
  property: Property;
  onOpen: (id: number) => void;
}

export default function PropertyCard({ property, onOpen }: Props) {
  return (
    <Card
      sx={{ border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: 'none', cursor: 'pointer' }}
      onClick={() => onOpen(property.id)}
    >
      <CardMedia
        component="img"
        height="160"
        image={property.image}
        alt={property.title}
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h6" sx={{ color: 'info.main', fontSize: '1.1rem' }}>{property.title}</Typography>
          <Box sx={{ bgcolor: '#f0f0f0', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.8rem' }}>
            {property.katha} Katha
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {property.address}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'info.main', mr: 1 }}>{property.status}:</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>{property.propertyType}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>• {property.bedrooms} Bedrooms</Typography>
          <Typography variant="body2" color="text.secondary">• {property.bathrooms} Bathroom</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">Company Name:</Typography>
          <Box sx={{ bgcolor: '#f0f0f0', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.8rem' }}>
            {property.companyName}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
