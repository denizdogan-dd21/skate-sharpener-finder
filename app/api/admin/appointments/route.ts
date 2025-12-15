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
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as any
    const skip = (page - 1) * limit

    const where: any = {}
    if (status && status !== 'ALL') {
      where.status = status
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          customer: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          sharpener: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          location: {
            select: {
              locationId: true,
              locationName: true,
              streetAddress: true,
              city: true,
              state: true,
              zipCode: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.appointment.count({ where }),
    ])

    return NextResponse.json({
      appointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}
