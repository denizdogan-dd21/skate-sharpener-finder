import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAppointmentRequestEmail } from '@/lib/email'

// Create appointment request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, sharpenerId, locationId, machineId, availabilityId, notes } = body

    if (!userId || !sharpenerId || !locationId || !machineId || !availabilityId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify availability exists
    const availability = await prisma.availability.findUnique({
      where: { availabilityId }
    })

    if (!availability) {
      return NextResponse.json(
        { error: 'Availability not found' },
        { status: 404 }
      )
    }

    // Get the requested time slot from body
    const { selectedInterval } = body
    if (!selectedInterval || !selectedInterval.start || !selectedInterval.end) {
      return NextResponse.json(
        { error: 'Time interval is required' },
        { status: 400 }
      )
    }

    // Check if this specific time slot is already booked
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        availabilityId,
        startTime: selectedInterval.start,
        endTime: selectedInterval.end,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      )
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        sharpenerId,
        locationId,
        machineId,
        availabilityId,
        requestedDate: availability.availableDate,
        startTime: selectedInterval.start,
        endTime: selectedInterval.end,
        notes: notes || '',
        status: 'PENDING',
      },
      include: {
        user: true,
        sharpener: true,
        location: true,
        machine: true,
      }
    })

    // Send email notification to sharpener
    try {
      await sendAppointmentRequestEmail({
        appointmentId: appointment.appointmentId,
        userName: `${appointment.user.firstName} ${appointment.user.lastName}`,
        userEmail: appointment.user.email,
        userPhone: appointment.user.phone,
        sharpenerName: `${appointment.sharpener.firstName} ${appointment.sharpener.lastName}`,
        sharpenerEmail: appointment.sharpener.email,
        date: new Date(appointment.requestedDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        locationName: appointment.location.locationName,
        machineType: appointment.machine?.machineType,
        notes: appointment.notes || undefined,
      })
    } catch (emailError) {
      console.error('Failed to send appointment request email:', emailError)
      // Don't fail the appointment creation if email fails
    }

    return NextResponse.json(
      {
        message: 'Appointment request created successfully',
        appointmentId: appointment.appointmentId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sharpenerId = searchParams.get('sharpenerId')

    if (!userId && !sharpenerId) {
      return NextResponse.json(
        { error: 'Either userId or sharpenerId is required' },
        { status: 400 }
      )
    }

    const where: any = {}
    if (userId) where.userId = parseInt(userId)
    if (sharpenerId) where.sharpenerId = parseInt(sharpenerId)

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        user: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          }
        },
        sharpener: {
          select: {
            sharpenerId: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          }
        },
        location: true,
        machine: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Apply progressive disclosure of contact information
    const formattedAppointments = appointments.map(apt => {
      const isConfirmed = apt.status === 'CONFIRMED' || apt.status === 'COMPLETED' || apt.status === 'RATED'
      
      // If querying by sharpenerId, show full user info (sharpener needs it to accept/deny)
      // If querying by userId, apply progressive disclosure
      const showFullUserInfo = sharpenerId !== null
      
      return {
        appointmentId: apt.appointmentId,
        availabilityId: apt.availabilityId,
        requestedDate: apt.requestedDate,
        startTime: apt.startTime,
        endTime: apt.endTime,
        status: apt.status,
        notes: apt.notes,
        user: (showFullUserInfo || isConfirmed) ? apt.user : {
          userId: apt.user.userId,
          firstName: apt.user.firstName,
          lastName: apt.user.lastName,
          phone: null, // Hidden until confirmed
          email: null,
        },
        sharpener: {
          userId: apt.sharpener.userId,
          firstName: apt.sharpener.firstName,
          lastName: apt.sharpener.lastName,
          phone: isConfirmed ? apt.sharpener.phone : null, // Hidden until confirmed
          email: isConfirmed ? apt.sharpener.email : null,
        },
        location: isConfirmed ? apt.location : {
          locationId: apt.location.locationId,
          locationName: apt.location.locationName,
          city: apt.location.city,
          state: apt.location.state,
          zipCode: apt.location.zipCode,
          streetAddress: null, // Hidden until confirmed
        },
        machine: apt.machine,
        createdAt: apt.createdAt,
      }
    })

    return NextResponse.json({ appointments: formattedAppointments })
  } catch (error) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
