import React, { useContext } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { PropertyContext } from '../context/PropertyContext'

type Props = {
  open: boolean
  id: number | null
  onClose: () => void
}

export default function PropertyDetailDialog({ open, id, onClose }: Props) {
  const { getPropertyById } = useContext(PropertyContext)
  const property = id ? getPropertyById(id) : null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{property?.title}</DialogTitle>
      <DialogContent>
        <img src={property?.image} alt={property?.title} style={{ width: '100%', borderRadius: 8 }} />
        <Typography sx={{ mt: 2 }}>{property?.description}</Typography>
        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>৳ {property?.price?.toLocaleString()}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained">Contact</Button>
      </DialogActions>
    </Dialog>
  )
}
