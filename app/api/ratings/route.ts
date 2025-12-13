import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentId, userId, rating, comment } = body

    if (!appointmentId || !userId || !rating) {
      return NextResponse.json(
        { error: 'appointmentId, userId, and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Verify appointment exists and belongs to user
    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    if (appointment.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Only allow rating COMPLETED appointments
    if (appointment.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only rate completed appointments' },
        { status: 400 }
      )
    }

    // Check if appointment date/time has passed
    const appointmentDateTime = new Date(appointment.requestedDate)
    const [hours, minutes] = appointment.endTime.split(':').map(Number)
    appointmentDateTime.setHours(hours, minutes, 0, 0)
    
    if (appointmentDateTime > new Date()) {
      return NextResponse.json(
        { error: 'Cannot rate appointments that have not occurred yet' },
        { status: 400 }
      )
    }

    // Update the rating entry
    const updatedRating = await prisma.rating.updateMany({
      where: {
        appointmentId,
        userId,
      },
      data: {
        rating,
        comment: comment || '',
      }
    })

    if (updatedRating.count === 0) {
      return NextResponse.json(
        { error: 'Rating entry not found' },
        { status: 404 }
      )
    }

    // Update appointment status to RATED
    await prisma.appointment.update({
      where: { appointmentId },
      data: { status: 'RATED' }
    })

    // Recalculate sharpener's average rating
    const allRatings = await prisma.rating.findMany({
      where: {
        sharpenerId: appointment.sharpenerId,
        rating: { gt: 0 } // Only count submitted ratings
      },
      select: { rating: true }
    })

    const totalRatings = allRatings.length
    const averageRating = totalRatings > 0
      ? allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : null

    await prisma.sharpener.update({
      where: { sharpenerId: appointment.sharpenerId },
      data: {
        averageRating,
        totalRatings,
      }
    })

    return NextResponse.json({
      message: 'Rating submitted successfully',
    })
  } catch (error) {
    console.error('Submit rating error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
