import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sharpenerId = parseInt(params.id)

    if (isNaN(sharpenerId)) {
      return NextResponse.json(
        { error: 'Invalid sharpener ID' },
        { status: 400 }
      )
    }

    // Get sharpener details
    const now = new Date()
    const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    
    const sharpener = await prisma.user.findUnique({
      where: { 
        userId: sharpenerId,
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        bio: true,
        averageRating: true,
        totalRatings: true,
        active: true,
        suspended: true,
        userType: true,
        locations: {
          where: { isActive: true },
          include: {
            machines: {
              where: { isActive: true }
            },
            availabilities: {
              where: {
                availableDate: {
                  gte: now,
                  lte: fourteenDaysFromNow
                }
              },
              orderBy: {
                availableDate: 'asc'
              }
            }
          }
        },
        receivedRatings: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10,
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    })

    if (!sharpener) {
      return NextResponse.json(
        { error: 'Sharpener not found' },
        { status: 404 }
      )
    }

    // Check if sharpener is suspended or inactive
    if (sharpener.userType !== 'SHARPENER' || !sharpener.active || sharpener.suspended) {
      return NextResponse.json(
        { error: 'Sharpener profile is not available' },
        { status: 404 }
      )
    }

    // Get all appointments for this sharpener to adjust availability times
    const appointments = await prisma.appointment.findMany({
      where: {
        sharpenerId,
        status: { in: ['PENDING', 'CONFIRMED'] }
      },
      select: {
        availabilityId: true,
        startTime: true,
        endTime: true,
      }
    })

    // Build a map of booked intervals per availability
    const bookedByAvailability: { [key: number]: { start: string; end: string }[] } = {}
    appointments.forEach(apt => {
      if (!bookedByAvailability[apt.availabilityId]) {
        bookedByAvailability[apt.availabilityId] = []
      }
      bookedByAvailability[apt.availabilityId].push({
        start: apt.startTime,
        end: apt.endTime
      })
    })

    // Function to adjust availability times based on bookings
    const adjustAvailabilityTimes = (avail: any) => {
      const bookings = bookedByAvailability[avail.availabilityId] || []
      
      if (bookings.length === 0) {
        return avail // No bookings, return as is
      }

      // Find earliest end time and latest start time
      let earliestEnd = avail.startTime
      let latestStart = avail.endTime

      bookings.forEach(booking => {
        // If booking starts at availability start, move start time to booking end
        if (booking.start === avail.startTime || booking.start < earliestEnd) {
          earliestEnd = booking.end
        }
        // If booking ends at availability end, move end time to booking start
        if (booking.end === avail.endTime || booking.end > latestStart) {
          latestStart = booking.start
        }
      })

      // Find the earliest booking end time (this becomes new start)
      const sortedByEnd = bookings.sort((a, b) => a.end.localeCompare(b.end))
      if (sortedByEnd.length > 0 && sortedByEnd[0].start <= avail.startTime) {
        earliestEnd = sortedByEnd[sortedByEnd.length - 1].end
        for (const booking of sortedByEnd) {
          if (booking.start <= avail.startTime) {
            earliestEnd = booking.end
          } else {
            break
          }
        }
      }

      // Find the latest booking start time (this becomes new end)
      const sortedByStart = bookings.sort((a, b) => b.start.localeCompare(a.start))
      if (sortedByStart.length > 0 && sortedByStart[0].end >= avail.endTime) {
        latestStart = sortedByStart[sortedByStart.length - 1].start
        for (const booking of sortedByStart) {
          if (booking.end >= avail.endTime) {
            latestStart = booking.start
          } else {
            break
          }
        }
      }

      return {
        ...avail,
        startTime: earliestEnd,
        endTime: latestStart,
      }
    }

    // Format response
    const response = {
      sharpenerId: sharpener.userId,
      name: `${sharpener.firstName} ${sharpener.lastName}`,
      bio: sharpener.bio,
      averageRating: sharpener.averageRating,
      totalRatings: sharpener.totalRatings,
      locations: sharpener.locations.map(location => ({
        locationId: location.locationId,
        locationName: location.locationName,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
        machines: location.machines,
        availabilities: location.availabilities.map(adjustAvailabilityTimes).filter(avail => avail.startTime < avail.endTime),
      })),
      recentReviews: sharpener.receivedRatings.map(rating => ({
        ratingId: rating.ratingId,
        rating: rating.rating,
        comment: rating.comment,
        userName: `${rating.customer.firstName} ${rating.customer.lastName}`,
        createdAt: rating.createdAt,
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get sharpener error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
