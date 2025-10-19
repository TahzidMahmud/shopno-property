import React, { createContext, useState, ReactNode } from 'react'
import { Property } from '../types'
import mockProperties from '../data/mockProperties'

type ContextValue = {
  properties: Property[]
  getPropertyById: (id: number) => Property | undefined
  addProperty: (p: Property) => void
}

export const PropertyContext = createContext<ContextValue>({
  properties: [],
  getPropertyById: () => undefined,
  addProperty: () => {}
})

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(mockProperties)

  function getPropertyById(id: number) {
    return properties.find(p => p.id === id)
  }

  function addProperty(p: Property) {
    setProperties(prev => [p, ...prev])
  }

  return (
    <PropertyContext.Provider value={{ properties, getPropertyById, addProperty }}>
      {children}
    </PropertyContext.Provider>
  )
}
