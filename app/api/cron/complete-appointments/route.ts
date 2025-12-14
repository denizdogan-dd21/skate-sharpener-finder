import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find CONFIRMED appointments where end time was more than 8 hours ago
    const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000)
    
    const appointmentsToComplete = await prisma.appointment.findMany({
      where: {
        status: 'CONFIRMED',
      },
      include: {
        user: true,
        sharpener: true,
      }
    })

    // Filter appointments where end time + 8 hours has passed
    const eligibleAppointments = appointmentsToComplete.filter(apt => {
      const appointmentDateTime = new Date(apt.requestedDate)
      const [hours, minutes] = apt.endTime.split(':').map(Number)
      appointmentDateTime.setHours(hours, minutes, 0, 0)
      
      // Add 8 hours to appointment end time
      const completionThreshold = new Date(appointmentDateTime.getTime() + 8 * 60 * 60 * 1000)
      
      return completionThreshold < new Date()
    })

    const completedCount = eligibleAppointments.length

    // Update appointments to COMPLETED and create rating entries
    for (const apt of eligibleAppointments) {
      // Update status to COMPLETED
      await prisma.appointment.update({
        where: { appointmentId: apt.appointmentId },
        data: { status: 'COMPLETED' }
      })

      // Check if rating entry exists
      const existingRating = await prisma.rating.findFirst({
        where: { appointmentId: apt.appointmentId }
      })

      // Create rating entry if it doesn't exist
      if (!existingRating) {
        await prisma.rating.create({
          data: {
            appointmentId: apt.appointmentId,
            userId: apt.userId,
            sharpenerId: apt.sharpenerId,
            rating: 0,
            comment: '',
          }
        })
      }
    }

    return NextResponse.json({
      message: `Successfully auto-completed ${completedCount} appointments`,
      completedCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Auto-complete appointments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
