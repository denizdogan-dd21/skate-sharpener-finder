import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.accountType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get counts
    const [
      totalCustomers,
      totalSharpeners,
      totalAppointments,
      activeAppointments,
      completedAppointments,
      totalRatings,
    ] = await Promise.all([
      prisma.user.count({ where: { userType: 'CUSTOMER', active: true } }),
      prisma.user.count({ where: { userType: 'SHARPENER', active: true } }),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
        },
      }),
      prisma.appointment.count({ where: { status: 'COMPLETED' } }),
      prisma.rating.count(),
    ])

    // Get average rating across all sharpeners
    const avgRating = await prisma.user.aggregate({
      where: {
        userType: 'SHARPENER',
        totalRatings: { gt: 0 },
      },
      _avg: {
        averageRating: true,
      },
    })

    return NextResponse.json({
      totalCustomers,
      totalSharpeners,
      totalAppointments,
      activeAppointments,
      completedAppointments,
      totalRatings,
      averageRating: avgRating._avg.averageRating || 0,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
