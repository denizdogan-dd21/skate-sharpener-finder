import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Create location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sharpenerId, locationName, streetAddress, city, state, zipCode } = body

    if (!sharpenerId || !locationName || !streetAddress || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const location = await prisma.sharpenerLocation.create({
      data: {
        sharpenerId,
        locationName,
        streetAddress,
        city,
        state,
        zipCode,
      }
    })

    return NextResponse.json(
      {
        message: 'Location created successfully',
        location,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create location error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get locations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sharpenerId = searchParams.get('sharpenerId')

    if (!sharpenerId) {
      return NextResponse.json(
        { error: 'sharpenerId is required' },
        { status: 400 }
      )
    }

    const locations = await prisma.sharpenerLocation.findMany({
      where: { sharpenerId: parseInt(sharpenerId) },
      include: {
        machines: {
          where: { isActive: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Get locations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
