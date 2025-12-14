import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
    await prisma.sharpenerLocation.update({
      where: { locationId: location.locationId },
      data: {
        latitude: coords.lat as any,
        longitude: coords.lon as any
      }
    })
    location.latitude = coords.lat
    location.longitude = coords.lon
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
      include: {
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

    // Fetch all appointments to check booked slots
    const appointments = await prisma.appointment.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      select: {
        availabilityId: true,
        startTime: true,
        endTime: true,
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
        
        // Filter out fully booked availabilities and adjust time ranges to show only available slots
        const availableSlots = location.availabilities.map((avail: any) => {
          // Get all booked intervals for this availability
          const bookedIntervals = appointments
            .filter((apt: any) => apt.availabilityId === avail.availabilityId)
            .map((apt: any) => ({
              start: apt.startTime,
              end: apt.endTime
            }))
          
          // Generate all possible 15-minute slots
          const [startHour, startMin] = avail.startTime.split(':').map(Number)
          const [endHour, endMin] = avail.endTime.split(':').map(Number)
          const startMinutes = startHour * 60 + startMin
          const endMinutes = endHour * 60 + endMin
          
          const allSlots = []
          for (let minutes = startMinutes; minutes < endMinutes; minutes += 15) {
            const slotStartHour = Math.floor(minutes / 60)
            const slotStartMin = minutes % 60
            const slotEndMinutes = minutes + 15
            const slotEndHour = Math.floor(slotEndMinutes / 60)
            const slotEndMin = slotEndMinutes % 60
            
            const slotStart = `${String(slotStartHour).padStart(2, '0')}:${String(slotStartMin).padStart(2, '0')}`
            const slotEnd = `${String(slotEndHour).padStart(2, '0')}:${String(slotEndMin).padStart(2, '0')}`
            
            allSlots.push({ start: slotStart, end: slotEnd })
          }
          
          // Filter out booked slots
          const freeSlots = allSlots.filter(slot => {
            return !bookedIntervals.some(booked => 
              booked.start === slot.start && booked.end === slot.end
            )
          })
          
          // If no free slots, return null
          if (freeSlots.length === 0) return null
          
          // Calculate min/max of free slots
          const minStartTime = freeSlots[0].start
          const maxEndTime = freeSlots[freeSlots.length - 1].end
          
          return {
            ...avail,
            startTime: minStartTime,
            endTime: maxEndTime
          }
        }).filter(Boolean) // Remove null entries (fully booked availabilities)
        
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
          upcomingAvailability: availableSlots,
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
