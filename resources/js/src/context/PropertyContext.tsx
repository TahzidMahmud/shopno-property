import React, { createContext, useState, ReactNode, useEffect } from 'react'
import { Property } from '../types'
import { propertyService } from '../services/propertyService'

type ContextValue = {
  properties: Property[]
  getPropertyById: (id: number) => Property | undefined
  addProperty: (p: Property) => void
  loading: boolean
}

export const PropertyContext = createContext<ContextValue>({
  properties: [],
  getPropertyById: () => undefined,
  addProperty: () => {},
  loading: false
})

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const data = await propertyService.getAll()
      setProperties(data)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  function getPropertyById(id: number) {
    return properties.find(p => p.id === id)
  }

  function addProperty(p: Property) {
    setProperties(prev => [p, ...prev])
  }

  return (
    <PropertyContext.Provider value={{ properties, getPropertyById, addProperty, loading }}>
      {children}
    </PropertyContext.Provider>
  )
}
