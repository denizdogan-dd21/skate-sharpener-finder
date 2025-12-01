import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Haversine formula to calculate distance between two points in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Geocode address using OpenStreetMap Nominatim API
async function geocodeAddress(city?: string, state?: string, zipCode?: string, country: string = 'Germany'): Promise<{ lat: number; lon: number } | null> {
  try {
    let url: string
    
    // If zipCode is provided, use ONLY zipCode for most accurate results
    if (zipCode) {
      const params = new URLSearchParams({
        postalcode: zipCode,
        country: country,
        format: 'json',
        limit: '1'
      })
      
      url = `https://nominatim.openstreetmap.org/search?${params.toString()}`
    } else {
      // Fallback to city/state query if no zipCode
      const parts = []
      if (city) parts.push(city)
      if (state) parts.push(state)
      parts.push(country)
      
      const query = parts.join(', ')
      url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
    }
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SkateSharpenerFinder/1.0'
      }
    })
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      }
    }
    
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// Geocode location and update database if needed
async function ensureLocationCoordinates(location: any): Promise<void> {
  if (location.latitude && location.longitude) {
    return // Already has coordinates
  }
  
  const coords = await geocodeAddress(location.city, location.state, location.zipCode)
  if (coords) {
    try {
      await prisma.sharpenerLocation.update({
        where: { locationId: location.locationId },
        data: {
          latitude: coords.lat as any,
          longitude: coords.lon as any
        }
      })
      location.latitude = coords.lat
      location.longitude = coords.lon
    } catch (error) {
      // Database doesn't have latitude/longitude columns yet
      // Just set them in memory for this request
      console.warn('Could not update location coordinates in database:', error)
      location.latitude = coords.lat
      location.longitude = coords.lon
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const zipCode = searchParams.get('zipCode')
    const maxDistance = 50 // Maximum distance in kilometers

    if (!city && !state && !zipCode) {
      return NextResponse.json(
        { error: 'At least one search parameter (city, state, or zipCode) is required' },
        { status: 400 }
      )
    }

    // Geocode the search address
    const searchCoords = await geocodeAddress(city || undefined, state || undefined, zipCode || undefined)
    
    if (!searchCoords) {
      return NextResponse.json(
        { error: 'Could not find coordinates for the specified location' },
        { status: 400 }
      )
    }

    // Fetch ALL active locations (no filtering by city/state/zipCode)
    const locations = await prisma.sharpenerLocation.findMany({
      where: {
        isActive: true
      },
      select: {
        locationId: true,
        locationName: true,
        streetAddress: true,
        city: true,
        state: true,
        zipCode: true,
        isActive: true,
        createdAt: true,
        sharpenerId: true,
        sharpener: {
          select: {
            sharpenerId: true,
            firstName: true,
            lastName: true,
            averageRating: true,
            totalRatings: true,
          }
        },
        machines: {
          where: { isActive: true },
          select: {
            machineId: true,
            machineType: true,
            radiusOptions: true,
          }
        },
        availabilities: {
          where: {
            availableDate: {
              gte: new Date(),
              lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Next 14 days
            }
          },
          orderBy: {
            availableDate: 'asc'
          },
          select: {
            availabilityId: true,
            availableDate: true,
            startTime: true,
            endTime: true,
            price: true,
          }
        }
      }
    })

    // Ensure all locations have coordinates and calculate distances
    const locationsWithDistance = await Promise.all(
      locations.map(async (location: any) => {
        await ensureLocationCoordinates(location)
        
        let distance = null
        if (location.latitude && location.longitude) {
          distance = calculateDistance(
            searchCoords.lat,
            searchCoords.lon,
            location.latitude,
            location.longitude
          )
        }
        
        return {
          sharpenerId: location.sharpener.sharpenerId,
          sharpenerName: `${location.sharpener.firstName} ${location.sharpener.lastName}`,
          averageRating: location.sharpener.averageRating,
          totalRatings: location.sharpener.totalRatings,
          locationId: location.locationId,
          locationName: location.locationName,
          city: location.city,
          state: location.state,
          zipCode: location.zipCode,
          latitude: location.latitude,
          longitude: location.longitude,
          distance: distance,
          machines: location.machines,
          upcomingAvailability: location.availabilities,
        }
      })
    )

    // Filter by maximum distance and sort by distance
    const results = locationsWithDistance
      .filter(loc => loc.distance !== null && loc.distance <= maxDistance)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))

    return NextResponse.json({ 
      results,
      searchCoordinates: searchCoords
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
