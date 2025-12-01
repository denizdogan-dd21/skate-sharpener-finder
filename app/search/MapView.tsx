'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SearchResult, SearchCoordinates } from '@/types'

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const searchIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const sharpenerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapViewProps {
  searchCoordinates: SearchCoordinates
  results: SearchResult[]
}

function MapBounds({ searchCoordinates, results }: MapViewProps) {
  const map = useMap()
  
  useEffect(() => {
    const bounds = L.latLngBounds([])
    
    // Add search location to bounds
    bounds.extend([searchCoordinates.lat, searchCoordinates.lon])
    
    // Add all sharpener locations to bounds
    results.forEach(result => {
      if (result.latitude && result.longitude) {
        bounds.extend([result.latitude, result.longitude])
      }
    })
    
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, searchCoordinates, results])
  
  return null
}

export default function MapView({ searchCoordinates, results }: MapViewProps) {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[searchCoordinates.lat, searchCoordinates.lon]}
        zoom={11}
        className="h-full w-full"
        style={{ minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds searchCoordinates={searchCoordinates} results={results} />
        
        {/* Search location marker */}
        <Marker
          position={[searchCoordinates.lat, searchCoordinates.lon]}
          icon={searchIcon}
        >
          <Popup>
            <div className="text-center">
              <strong className="text-red-600">Your Search Location</strong>
            </div>
          </Popup>
        </Marker>
        
        {/* Sharpener location markers */}
        {results.map((result) => {
          if (!result.latitude || !result.longitude) return null
          
          return (
            <Marker
              key={result.locationId}
              position={[result.latitude, result.longitude]}
              icon={sharpenerIcon}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-gray-900 mb-1">{result.sharpenerName}</h3>
                  <p className="text-sm text-gray-600 mb-1">{result.locationName}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {result.city}, {result.state} {result.zipCode}
                  </p>
                  {result.distance !== null && (
                    <p className="text-sm font-semibold text-primary-600 mb-1">
                      📍 {result.distance.toFixed(1)} km away
                    </p>
                  )}
                  {result.averageRating && (
                    <p className="text-sm text-yellow-600 mb-2">
                      ⭐ {result.averageRating.toFixed(1)}
                    </p>
                  )}
                  {result.upcomingAvailability && result.upcomingAvailability.length > 0 && (
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Available next 7 days
                    </p>
                  )}
                  <a
                    href={`/sharpener/${result.sharpenerId}`}
                    className="inline-block mt-2 text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700"
                  >
                    View Profile
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
