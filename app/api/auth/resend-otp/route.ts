import { NextRequest, NextResponse } from 'next/server'
import { createAndSendOTP } from '@/lib/otp'
import { UserType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { email, userType } = await request.json()

    if (!email || !userType) {
      return NextResponse.json(
        { error: 'Email and user type are required' },
        { status: 400 }
      )
    }

    // Send new OTP
    const sent = await createAndSendOTP(email, userType as UserType)

    if (!sent) {
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to resend code' },
      { status: 500 }
    )
  }
}
