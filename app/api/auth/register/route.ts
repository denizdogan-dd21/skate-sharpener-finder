import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validateEmail, validatePassword, validatePhone } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone, accountType } = body

    // Validation
    if (!email || !password || !firstName || !lastName || !phone || !accountType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      )
    }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    if (accountType !== 'user' && accountType !== 'sharpener') {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Check if email already exists
    if (accountType === 'user') {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        )
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
        }
      })

      // Generate verification token
      const token = randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Delete any existing tokens for this email/accountType
      await prisma.emailVerificationToken.deleteMany({
        where: { email, accountType: 'user' }
      })

      // Create new verification token
      await prisma.emailVerificationToken.create({
        data: {
          email,
          token,
          accountType: 'user',
          expiresAt,
        }
      })

      // Send verification email
      const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`
      try {
        await sendVerificationEmail({
          email,
          firstName,
          accountType: 'user',
          verificationUrl,
        })
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError)
        // Continue anyway - user is created
      }

      return NextResponse.json(
        { 
          message: 'Registration successful. Please check your email to verify your account.',
          requiresVerification: true,
          accountType: 'user'
        },
        { status: 201 }
      )
    } else {
      const existingSharpener = await prisma.sharpener.findUnique({
        where: { email }
      })
      if (existingSharpener) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        )
      }

      // Create sharpener
      const sharpener = await prisma.sharpener.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          bio: body.bio || '',
        }
      })

      // Generate verification token
      const token = randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Delete any existing tokens for this email/accountType
      await prisma.emailVerificationToken.deleteMany({
        where: { email, accountType: 'sharpener' }
      })

      // Create new verification token
      await prisma.emailVerificationToken.create({
        data: {
          email,
          token,
          accountType: 'sharpener',
          expiresAt,
        }
      })

      // Send verification email
      const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`
      try {
        await sendVerificationEmail({
          email,
          firstName,
          accountType: 'sharpener',
          verificationUrl,
        })
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError)
        // Continue anyway - user is created
      }

      return NextResponse.json(
        { 
          message: 'Registration successful. Please check your email to verify your account.',
          requiresVerification: true,
          accountType: 'sharpener'
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
