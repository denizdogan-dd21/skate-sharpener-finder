import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, validateEmail } from '@/lib/auth'
import { createAndSendOTP } from '@/lib/otp'
import { UserType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, accountType } = body

    // Validation
    if (!email || !password || !accountType) {
      return NextResponse.json(
        { error: 'Email, password, and account type are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Map accountType to UserType enum
    let userType: UserType
    if (accountType === 'user') {
      userType = 'CUSTOMER'
    } else if (accountType === 'sharpener') {
      userType = 'SHARPENER'
    } else if (accountType === 'admin') {
      userType = 'ADMIN'
    } else {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      )
    }

    // Find user with matching email and userType
    const user = await prisma.user.findUnique({
      where: {
        email_userType: {
          email,
          userType,
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate and send OTP
    const otpSent = await createAndSendOTP(email, userType)
    if (!otpSent) {
      return NextResponse.json(
        { error: 'Failed to send verification code. Please try again.' },
        { status: 500 }
      )
    }

    // Return success - user needs to verify OTP next
    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      requiresOTP: true,
      email,
      userType,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
