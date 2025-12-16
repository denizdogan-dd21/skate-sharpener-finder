import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentId, userId, rating, comment } = body

    // Validate input
    if (!appointmentId || !userId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if appointment exists and belongs to user
    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId },
      include: { sharpener: true }
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

    if (appointment.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only rate completed appointments' },
        { status: 400 }
      )
    }

    // Update or create rating
    const existingRating = await prisma.rating.findFirst({
      where: { appointmentId }
    })

    let updatedRating
    if (existingRating) {
      updatedRating = await prisma.rating.update({
        where: { ratingId: existingRating.ratingId },
        data: {
          rating,
          comment: comment || null,
        }
      })
    } else {
      updatedRating = await prisma.rating.create({
        data: {
          appointmentId,
          userId,
          sharpenerId: appointment.sharpenerId,
          rating,
          comment: comment || null,
        }
      })
    }

    // Update appointment status to RATED
    await prisma.appointment.update({
      where: { appointmentId },
      data: { status: 'RATED' }
    })

    // Recalculate sharpener's average rating and total ratings
    const allRatings = await prisma.rating.findMany({
      where: {
        sharpenerId: appointment.sharpenerId,
        rating: { not: null } // Only count ratings that have been submitted
      }
    })

    const totalRatings = allRatings.length
    const averageRating = totalRatings > 0 
      ? allRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRatings
      : null

    await prisma.user.update({
      where: { userId: appointment.sharpenerId },
      data: {
        averageRating,
        totalRatings,
      }
    })

    return NextResponse.json({
      message: 'Rating submitted successfully',
      rating: updatedRating
    })
  } catch (error) {
    console.error('Rating submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
