import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAppointmentAcceptedEmail } from '@/lib/email'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = parseInt(params.id)

    if (isNaN(appointmentId)) {
      return NextResponse.redirect(new URL('/dashboard?error=invalid', process.env.NEXTAUTH_URL!))
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
      return NextResponse.redirect(new URL('/dashboard?error=notfound', process.env.NEXTAUTH_URL!))
    }

    if (appointment.status !== 'PENDING') {
      return NextResponse.redirect(new URL('/dashboard?error=already-processed', process.env.NEXTAUTH_URL!))
    }

    // Update appointment status
    await prisma.appointment.update({
      where: { appointmentId },
      data: { status: 'CONFIRMED' }
    })

    // Create rating entry for completed appointments
    const existingRating = await prisma.rating.findFirst({
      where: { appointmentId }
    })

    if (!existingRating) {
      await prisma.rating.create({
        data: {
          appointmentId: appointment.appointmentId,
          userId: appointment.userId,
          sharpenerId: appointment.sharpenerId,
          rating: null,
          comment: null,
        }
      })
    }

    // Send confirmation email to user
    try {
      await sendAppointmentAcceptedEmail({
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
        locationAddress: appointment.location.streetAddress,
        machineType: appointment.machine?.machineType,
        notes: appointment.notes || undefined,
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
    }

    return NextResponse.redirect(new URL('/dashboard?success=accepted', process.env.NEXTAUTH_URL!))
  } catch (error) {
    console.error('Accept appointment error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=server', process.env.NEXTAUTH_URL!))
  }
}
