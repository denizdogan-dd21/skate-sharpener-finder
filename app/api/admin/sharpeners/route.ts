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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [sharpeners, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          userType: 'SHARPENER',
        },
        select: {
          userId: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          active: true,
          suspended: true,
          suspensionReason: true,
          suspensionEndDate: true,
          averageRating: true,
          totalRatings: true,
          createdAt: true,
          _count: {
            select: {
              sharpenerAppointments: true,
              sharpenerRatings: true,
              locations: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({
        where: {
          userType: 'SHARPENER',
        },
      }),
    ])

    return NextResponse.json({
      sharpeners,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get sharpeners error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sharpeners' },
      { status: 500 }
    )
  }
}
