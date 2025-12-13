import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Create availability
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { locationId, machineId, availableDate, startTime, endTime, price } = body

    if (!locationId || !machineId || !availableDate || !startTime || !endTime || price === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM' },
        { status: 400 }
      )
    }

    const availability = await prisma.availability.create({
      data: {
        locationId,
        machineId,
        availableDate: new Date(availableDate),
        startTime,
        endTime,
        price: parseFloat(price),
      }
    })

    return NextResponse.json(
      {
        message: 'Availability created successfully',
        availability,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create availability error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get availabilities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')
    const machineId = searchParams.get('machineId')

    if (!locationId) {
      return NextResponse.json(
        { error: 'locationId is required' },
        { status: 400 }
      )
    }

    const where: any = { locationId: parseInt(locationId) }
    if (machineId) {
      where.machineId = parseInt(machineId)
    }

    const availabilities = await prisma.availability.findMany({
      where,
      include: {
        machine: {
          select: {
            machineType: true,
            radiusOptions: true,
          }
        }
      },
      orderBy: {
        availableDate: 'asc'
      }
    })

    return NextResponse.json({ availabilities })
  } catch (error) {
    console.error('Get availabilities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete availability
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const availabilityId = searchParams.get('availabilityId')

    if (!availabilityId) {
      return NextResponse.json(
        { error: 'availabilityId is required' },
        { status: 400 }
      )
    }

    // Check if there are any active appointments
    const activeAppointments = await prisma.appointment.findFirst({
      where: { 
        availabilityId: parseInt(availabilityId),
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    if (activeAppointments) {
      return NextResponse.json(
        { error: 'Cannot delete availability with active appointments' },
        { status: 409 }
      )
    }

    await prisma.availability.delete({
      where: { availabilityId: parseInt(availabilityId) }
    })

    return NextResponse.json({ message: 'Availability deleted successfully' })
  } catch (error) {
    console.error('Delete availability error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
