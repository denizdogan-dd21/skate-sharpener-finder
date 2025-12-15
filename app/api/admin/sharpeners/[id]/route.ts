import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)

    const sharpener = await prisma.user.findUnique({
      where: { userId },
      include: {
        locations: {
          include: {
            _count: {
              select: {
                appointments: true,
              },
            },
          },
        },
        machines: true,
        sharpenerAppointments: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            location: {
              select: {
                locationName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20, // Last 20 appointments
        },
        receivedRatings: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        availabilities: {
          orderBy: {
            date: 'desc',
          },
          take: 10, // Next 10 availabilities
        },
      },
    })

    if (!sharpener || sharpener.userType !== 'SHARPENER') {
      return NextResponse.json(
        { error: 'Sharpener not found' },
        { status: 404 }
      )
    }

    // Calculate statistics
    const stats = {
      totalAppointments: sharpener.sharpenerAppointments.length,
      pending: sharpener.sharpenerAppointments.filter((a: any) => a.status === 'PENDING').length,
      confirmed: sharpener.sharpenerAppointments.filter((a: any) => a.status === 'CONFIRMED').length,
      completed: sharpener.sharpenerAppointments.filter((a: any) => a.status === 'COMPLETED').length,
      cancelled: sharpener.sharpenerAppointments.filter((a: any) => a.status === 'CANCELLED').length,
      denied: sharpener.sharpenerAppointments.filter((a: any) => a.status === 'DENIED').length,
      noShow: sharpener.sharpenerAppointments.filter((a: any) => a.status === 'NO_SHOW').length,
      ratingsReceived: sharpener.receivedRatings.length,
      averageRating: sharpener.averageRating || 0,
      locations: sharpener.locations.length,
      machines: sharpener.machines.length,
    }

    return NextResponse.json({
      sharpener,
      stats,
    })
  } catch (error) {
    console.error('Get sharpener details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sharpener details' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.accountType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = parseInt(params.id)
    const { action, reason, duration } = await request.json()

    const targetUser = await prisma.user.findUnique({
      where: { userId },
      select: { email: true, userType: true }
    })

    if (!targetUser || targetUser.userType !== 'SHARPENER') {
      return NextResponse.json(
        { error: 'Sharpener not found' },
        { status: 404 }
      )
    }

    if (action === 'suspend') {
      let suspensionEndDate = null
      if (duration && duration !== 'permanent') {
        const days = parseInt(duration)
        suspensionEndDate = new Date()
        suspensionEndDate.setDate(suspensionEndDate.getDate() + days)
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { userId },
          data: {
            suspended: true,
            suspensionReason: reason || 'Account suspended by admin',
            suspensionEndDate,
          },
        }),
        prisma.adminAction.create({
          data: {
            adminId: session.user.id,
            actionType: 'SUSPEND',
            targetUserId: userId,
            targetUserEmail: targetUser.email,
            reason: reason || 'Account suspended by admin',
          },
        }),
      ])

      return NextResponse.json({ success: true, message: 'Sharpener suspended' })
    }

    if (action === 'unsuspend') {
      await prisma.$transaction([
        prisma.user.update({
          where: { userId },
          data: {
            suspended: false,
            suspensionReason: null,
            suspensionEndDate: null,
          },
        }),
        prisma.adminAction.create({
          data: {
            adminId: session.user.id,
            actionType: 'UNSUSPEND',
            targetUserId: userId,
            targetUserEmail: targetUser.email,
            reason: 'Account unsuspended by admin',
          },
        }),
      ])

      return NextResponse.json({ success: true, message: 'Sharpener unsuspended' })
    }

    if (action === 'deactivate') {
      await prisma.$transaction([
        prisma.user.update({
          where: { userId },
          data: {
            active: false,
          },
        }),
        prisma.adminAction.create({
          data: {
            adminId: session.user.id,
            actionType: 'DEACTIVATE',
            targetUserId: userId,
            targetUserEmail: targetUser.email,
            reason: 'Account deactivated by admin',
          },
        }),
      ])

      return NextResponse.json({ success: true, message: 'Sharpener deactivated' })
    }

    if (action === 'activate') {
      await prisma.$transaction([
        prisma.user.update({
          where: { userId },
          data: {
            active: true,
          },
        }),
        prisma.adminAction.create({
          data: {
            adminId: session.user.id,
            actionType: 'ACTIVATE',
            targetUserId: userId,
            targetUserEmail: targetUser.email,
            reason: 'Account activated by admin',
          },
        }),
      ])

      return NextResponse.json({ success: true, message: 'Sharpener activated' })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Sharpener action error:', error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}
