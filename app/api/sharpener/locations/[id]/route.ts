import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Update location
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const locationId = parseInt(params.id)
    const body = await request.json()
    const { locationName, streetAddress, city, state, zipCode, sharpenerId } = body

    // Verify ownership
    const existingLocation = await prisma.sharpenerLocation.findUnique({
      where: { locationId }
    })

    if (!existingLocation) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    if (existingLocation.sharpenerId !== sharpenerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updatedLocation = await prisma.sharpenerLocation.update({
      where: { locationId },
      data: {
        locationName,
        streetAddress,
        city,
        state,
        zipCode,
      }
    })

    return NextResponse.json({ location: updatedLocation })
  } catch (error) {
    console.error('Update location error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete location
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const locationId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const sharpenerId = parseInt(searchParams.get('sharpenerId') || '0')

    if (!sharpenerId) {
      return NextResponse.json(
        { error: 'Sharpener ID required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const existingLocation = await prisma.sharpenerLocation.findUnique({
      where: { locationId }
    })

    if (!existingLocation) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    if (existingLocation.sharpenerId !== sharpenerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete location (cascade will handle related data)
    await prisma.sharpenerLocation.delete({
      where: { locationId }
    })

    return NextResponse.json({ message: 'Location deleted successfully' })
  } catch (error) {
    console.error('Delete location error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
