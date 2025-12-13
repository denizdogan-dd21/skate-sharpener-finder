import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Get admin password from request
    const { adminPassword } = await request.json()

    // Check admin password
    if (!process.env.ADMIN_SECRET || adminPassword !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔍 Finding unverified users and sharpeners...')

    // Get unverified users
    const unverifiedUsers = await prisma.user.findMany({
      where: { isEmailVerified: false },
      select: { userId: true, email: true, firstName: true, lastName: true }
    })

    // Get unverified sharpeners
    const unverifiedSharpeners = await prisma.sharpener.findMany({
      where: { isEmailVerified: false },
      select: { sharpenerId: true, email: true, firstName: true, lastName: true }
    })

    console.log(`Found ${unverifiedUsers.length} unverified users`)
    console.log(`Found ${unverifiedSharpeners.length} unverified sharpeners`)

    if (unverifiedUsers.length === 0 && unverifiedSharpeners.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All users are already verified',
        usersVerified: 0,
        sharpenersVerified: 0
      })
    }

    // Verify all users
    let userResult = { count: 0 }
    if (unverifiedUsers.length > 0) {
      userResult = await prisma.user.updateMany({
        where: { isEmailVerified: false },
        data: { isEmailVerified: true }
      })
      console.log(`✅ Verified ${userResult.count} users`)
    }

    // Verify all sharpeners
    let sharpenerResult = { count: 0 }
    if (unverifiedSharpeners.length > 0) {
      sharpenerResult = await prisma.sharpener.updateMany({
        where: { isEmailVerified: false },
        data: { isEmailVerified: true }
      })
      console.log(`✅ Verified ${sharpenerResult.count} sharpeners`)
    }

    // Clean up any orphaned verification tokens
    const deletedTokens = await prisma.emailVerificationToken.deleteMany({})
    console.log(`🧹 Cleaned up ${deletedTokens.count} unused verification tokens`)

    return NextResponse.json({
      success: true,
      message: 'All existing users have been verified',
      usersVerified: userResult.count,
      sharpenersVerified: sharpenerResult.count,
      tokensDeleted: deletedTokens.count,
      users: unverifiedUsers.map((u: any) => ({ email: u.email, name: `${u.firstName} ${u.lastName}` })),
      sharpeners: unverifiedSharpeners.map((s: any) => ({ email: s.email, name: `${s.firstName} ${s.lastName}` }))
    })

  } catch (error) {
    console.error('Error verifying users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
