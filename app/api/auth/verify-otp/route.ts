import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'
import { prisma } from '@/lib/prisma'
import { signIn } from 'next-auth/react'

type UserType = 'CUSTOMER' | 'SHARPENER' | 'ADMIN'

export async function POST(request: NextRequest) {
  try {
    const { email, userType, token } = await request.json()

    if (!email || !userType || !token) {
      return NextResponse.json(
        { error: 'Email, user type, and token are required' },
        { status: 400 }
      )
    }

    // Verify the OTP
    const result = await verifyOTP(email, userType as UserType, token)

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error || 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: {
        email_userType: {
          email,
          userType: userType as UserType,
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check account status
    if (!user.active) {
      return NextResponse.json(
        { error: 'Account has been deactivated. Please contact admin at denizdogan@gmail.com' },
        { status: 403 }
      )
    }

    if (user.suspended) {
      // Check if suspension has expired
      if (user.suspensionEndDate && user.suspensionEndDate < new Date()) {
        // Auto-unsuspend
        await prisma.user.update({
          where: { userId: user.userId },
          data: { suspended: false, suspensionReason: null, suspensionEndDate: null },
        })
      } else {
        const reason = user.suspensionReason || 'Your account has been suspended'
        const endDate = user.suspensionEndDate
          ? ` until ${user.suspensionEndDate.toLocaleDateString()}`
          : ' indefinitely'
        return NextResponse.json(
          { error: `${reason}${endDate}. Contact admin at denizdogan@gmail.com` },
          { status: 403 }
        )
      }
    }

    // Return success - the client will handle creating the session
    return NextResponse.json({
      success: true,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
