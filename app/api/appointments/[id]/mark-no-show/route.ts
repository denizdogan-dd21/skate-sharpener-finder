import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.accountType !== 'sharpener') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const appointmentId = parseInt(params.id)

    // Get the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId },
      include: {
        sharpener: true,
        customer: true,
      },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Verify the sharpener owns this appointment
    if (appointment.sharpenerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Only CONFIRMED appointments can be marked as no-show
    if (appointment.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Only confirmed appointments can be marked as no-show' },
        { status: 400 }
      )
    }

    // Update appointment status to NO_SHOW
    await prisma.appointment.update({
      where: { appointmentId },
      data: {
        status: 'NO_SHOW',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Appointment marked as no-show',
    })
  } catch (error) {
    console.error('Mark no-show error:', error)
    return NextResponse.json(
      { error: 'Failed to mark appointment as no-show' },
      { status: 500 }
    )
  }
}
