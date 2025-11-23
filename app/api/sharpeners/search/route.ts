import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const zipCode = searchParams.get('zipCode')

    if (!city && !state && !zipCode) {
      return NextResponse.json(
        { error: 'At least one search parameter (city, state, or zipCode) is required' },
        { status: 400 }
      )
    }

    // Build where clause
    const where: any = {
      isActive: true
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }
    if (state) {
      where.state = { contains: state, mode: 'insensitive' }
    }
    if (zipCode) {
      where.zipCode = zipCode
    }

    // Search for locations and include sharpener details
    const locations = await prisma.sharpenerLocation.findMany({
      where,
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
              lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
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
      },
      orderBy: {
        sharpener: {
          averageRating: 'desc'
        }
      }
    })

    // Format response
    const results = locations.map(location => ({
      sharpenerId: location.sharpener.sharpenerId,
      sharpenerName: `${location.sharpener.firstName} ${location.sharpener.lastName}`,
      averageRating: location.sharpener.averageRating,
      totalRatings: location.sharpener.totalRatings,
      locationId: location.locationId,
      locationName: location.locationName,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      machines: location.machines,
      upcomingAvailability: location.availabilities,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
