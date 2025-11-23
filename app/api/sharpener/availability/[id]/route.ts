import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PATCH - Update availability
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const availabilityId = parseInt(params.id)
    const body = await request.json()
    const { availableDate, startTime, endTime, price } = body

    // Check if availability exists and is not booked
    const existing = await prisma.availability.findUnique({
      where: { availabilityId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Availability not found' },
        { status: 404 }
      )
    }

    if (existing.isBooked) {
      return NextResponse.json(
        { error: 'Cannot edit a booked availability' },
        { status: 400 }
      )
    }

    // Update the availability
    const updated = await prisma.availability.update({
      where: { availabilityId },
      data: {
        availableDate: availableDate ? new Date(availableDate) : undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        price: price ? parseFloat(price) : undefined
      }
    })

    return NextResponse.json({
      message: 'Availability updated successfully',
      availability: updated
    })
  } catch (error) {
    console.error('Update availability error:', error)
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    )
  }
}

// DELETE - Delete availability
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const availabilityId = parseInt(params.id)

    // Check if availability exists and is not booked
    const existing = await prisma.availability.findUnique({
      where: { availabilityId },
      include: {
        appointments: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED']
            }
          }
        }
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Availability not found' },
        { status: 404 }
      )
    }

    if (existing.appointments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete availability with pending or confirmed appointments' },
        { status: 400 }
      )
    }

    // Delete the availability
    await prisma.availability.delete({
      where: { availabilityId }
    })

    return NextResponse.json({
      message: 'Availability deleted successfully'
    })
  } catch (error) {
    console.error('Delete availability error:', error)
    return NextResponse.json(
      { error: 'Failed to delete availability' },
      { status: 500 }
    )
  }
}
