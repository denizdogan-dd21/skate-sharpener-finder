import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find the verification token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.emailVerificationToken.delete({
        where: { token }
      })
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email_userType: {
          email: verificationToken.email,
          userType: verificationToken.userType
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.isEmailVerified) {
      // Delete the token
      await prisma.emailVerificationToken.delete({
        where: { token }
      })
      return NextResponse.json(
        { 
          alreadyVerified: true,
          message: 'Your email is already verified. You can log in now.',
          accountType: verificationToken.userType === 'CUSTOMER' ? 'user' : 'sharpener'
        },
        { status: 200 }
      )
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { userId: user.userId },
      data: { isEmailVerified: true }
    })

    // Delete the verification token
    await prisma.emailVerificationToken.delete({
      where: { token }
    })

    return NextResponse.json(
      { 
        message: 'Email verified successfully! You can now log in.',
        accountType: verificationToken.userType === 'CUSTOMER' ? 'user' : 'sharpener'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
