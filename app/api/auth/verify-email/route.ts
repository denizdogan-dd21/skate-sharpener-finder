import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find the verification token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 404 }
      )
    }

    // Check if token is expired
    if (new Date() > verificationToken.expiresAt) {
      // Delete expired token
      await prisma.emailVerificationToken.delete({
        where: { token }
      })

      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new one.' },
        { status: 410 }
      )
    }

    // Update user or sharpener based on accountType
    if (verificationToken.accountType === 'user') {
      const user = await prisma.user.findUnique({
        where: { email: verificationToken.email }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      if (user.isEmailVerified) {
        // Already verified, delete token and return success
        await prisma.emailVerificationToken.delete({
          where: { token }
        })

        return NextResponse.json(
          { message: 'Email already verified', alreadyVerified: true },
          { status: 200 }
        )
      }

      // Update user
      await prisma.user.update({
        where: { email: verificationToken.email },
        data: { isEmailVerified: true }
      })

      // Delete the token
      await prisma.emailVerificationToken.delete({
        where: { token }
      })

      return NextResponse.json(
        { 
          message: 'Email verified successfully! You can now login.',
          accountType: 'user'
        },
        { status: 200 }
      )
    } else if (verificationToken.accountType === 'sharpener') {
      const sharpener = await prisma.sharpener.findUnique({
        where: { email: verificationToken.email }
      })

      if (!sharpener) {
        return NextResponse.json(
          { error: 'Sharpener not found' },
          { status: 404 }
        )
      }

      if (sharpener.isEmailVerified) {
        // Already verified, delete token and return success
        await prisma.emailVerificationToken.delete({
          where: { token }
        })

        return NextResponse.json(
          { message: 'Email already verified', alreadyVerified: true },
          { status: 200 }
        )
      }

      // Update sharpener
      await prisma.sharpener.update({
        where: { email: verificationToken.email },
        data: { isEmailVerified: true }
      })

      // Delete the token
      await prisma.emailVerificationToken.delete({
        where: { token }
      })

      return NextResponse.json(
        { 
          message: 'Email verified successfully! You can now login.',
          accountType: 'sharpener'
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
