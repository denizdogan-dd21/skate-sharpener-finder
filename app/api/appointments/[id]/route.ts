import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAppointmentAcceptedEmail, sendAppointmentDeniedEmail, sendAppointmentCancelledEmail } from '@/lib/email'

// Get appointment details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = parseInt(params.id)

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: 'Invalid appointment ID' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId },
      include: {
        user: true,
        sharpener: true,
        location: true,
        machine: true,
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Apply progressive disclosure
    const isConfirmed = appointment.status === 'CONFIRMED' || 
                       appointment.status === 'COMPLETED' || 
                       appointment.status === 'RATED'

    return NextResponse.json({
      appointmentId: appointment.appointmentId,
      requestedDate: appointment.requestedDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
      notes: appointment.notes,
      user: isConfirmed ? appointment.user : {
        userId: appointment.user.userId,
        firstName: appointment.user.firstName,
        lastName: appointment.user.lastName,
        email: appointment.user.email,
        phone: null,
      },
      sharpener: {
        userId: appointment.sharpener.userId,
        firstName: appointment.sharpener.firstName,
        lastName: appointment.sharpener.lastName,
        email: appointment.sharpener.email,
        phone: isConfirmed ? appointment.sharpener.phone : null,
      },
      location: isConfirmed ? appointment.location : {
        locationId: appointment.location.locationId,
        locationName: appointment.location.locationName,
        city: appointment.location.city,
        state: appointment.location.state,
        zipCode: appointment.location.zipCode,
        streetAddress: null,
      },
      machine: appointment.machine,
      createdAt: appointment.createdAt,
    })
  } catch (error) {
    console.error('Get appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = parseInt(params.id)
    const body = await request.json()
    const { status, sharpenerId } = body

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: 'Invalid appointment ID' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'DENIED', 'CANCELLED', 'COMPLETED', 'RATED', 'EXPIRED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Verify appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Authorization check
    // Sharpeners can confirm/deny, users can cancel
    if ((status === 'CONFIRMED' || status === 'DENIED') && 
        appointment.sharpenerId !== sharpenerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    if (status === 'CANCELLED' && body.userId && appointment.userId !== body.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { appointmentId },
      data: { status },
      include: {
        user: true,
        sharpener: true,
        location: true,
        machine: true,
      }
    })

    // Send email notifications
    try {
      if (status === 'CONFIRMED') {
        await sendAppointmentAcceptedEmail({
          appointmentId: updatedAppointment.appointmentId,
          userName: `${updatedAppointment.user.firstName} ${updatedAppointment.user.lastName}`,
          userEmail: updatedAppointment.user.email,
          userPhone: updatedAppointment.user.phone,
          sharpenerName: `${updatedAppointment.sharpener.firstName} ${updatedAppointment.sharpener.lastName}`,
          sharpenerEmail: updatedAppointment.sharpener.email,
          date: new Date(updatedAppointment.requestedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          startTime: updatedAppointment.startTime,
          endTime: updatedAppointment.endTime,
          locationName: updatedAppointment.location.locationName,
          locationAddress: updatedAppointment.location.streetAddress,
          machineType: updatedAppointment.machine?.machineType,
          notes: updatedAppointment.notes || undefined,
        })
      } else if (status === 'DENIED') {
        await sendAppointmentDeniedEmail({
          appointmentId: updatedAppointment.appointmentId,
          userName: `${updatedAppointment.user.firstName} ${updatedAppointment.user.lastName}`,
          userEmail: updatedAppointment.user.email,
          userPhone: updatedAppointment.user.phone,
          sharpenerName: `${updatedAppointment.sharpener.firstName} ${updatedAppointment.sharpener.lastName}`,
          sharpenerEmail: updatedAppointment.sharpener.email,
          date: new Date(updatedAppointment.requestedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          startTime: updatedAppointment.startTime,
          endTime: updatedAppointment.endTime,
          locationName: updatedAppointment.location.locationName,
          machineType: updatedAppointment.machine?.machineType,
          notes: updatedAppointment.notes || undefined,
        })
      } else if (status === 'CANCELLED') {
        await sendAppointmentCancelledEmail({
          appointmentId: updatedAppointment.appointmentId,
          userName: `${updatedAppointment.user.firstName} ${updatedAppointment.user.lastName}`,
          userEmail: updatedAppointment.user.email,
          userPhone: updatedAppointment.user.phone,
          sharpenerName: `${updatedAppointment.sharpener.firstName} ${updatedAppointment.sharpener.lastName}`,
          sharpenerEmail: updatedAppointment.sharpener.email,
          date: new Date(updatedAppointment.requestedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          startTime: updatedAppointment.startTime,
          endTime: updatedAppointment.endTime,
          locationName: updatedAppointment.location.locationName,
          machineType: updatedAppointment.machine?.machineType,
          notes: updatedAppointment.notes || undefined,
        })
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the update if email fails
    }

    // Create rating entry only for completed appointments
    if (status === 'COMPLETED') {
      // Check if rating already exists
      const existingRating = await prisma.rating.findFirst({
        where: { appointmentId }
      })

      if (!existingRating) {
        await prisma.rating.create({
          data: {
            appointmentId: appointment.appointmentId,
            userId: appointment.userId,
            sharpenerId: appointment.sharpenerId,
            rating: 0, // Placeholder
            comment: '',
          }
        })
      }
    }

    // No need to update availability - time slots are tracked through appointments

    return NextResponse.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    })
  } catch (error) {
    console.error('Update appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
