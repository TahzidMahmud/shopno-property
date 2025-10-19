import React from 'react'
import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material'
import { Property } from '../types'

type Props = {
  property: Property
  onOpen: (id: number) => void
}

export default function PropertyCard({ property, onOpen }: Props) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="160"
        image={property.image}
        alt={property.title}
      />
      <CardContent>
        <Typography variant="h6">{property.title}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {property.description}
        </Typography>
        <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
          ৳ {property.price.toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onOpen(property.id)}>View</Button>
      </CardActions>
    </Card>
  )
}
