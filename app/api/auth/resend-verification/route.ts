import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { randomUUID } from 'crypto'

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const key = email.toLowerCase()
  const limit = rateLimitMap.get(key)

  if (limit) {
    // Reset if hour has passed
    if (now > limit.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + 60 * 60 * 1000 })
      return { allowed: true }
    }

    // Check if limit exceeded
    if (limit.count >= 3) {
      const retryAfter = Math.ceil((limit.resetTime - now) / 1000)
      return { allowed: false, retryAfter }
    }

    // Increment count
    limit.count++
    return { allowed: true }
  } else {
    // First request
    rateLimitMap.set(key, { count: 1, resetTime: now + 60 * 60 * 1000 })
    return { allowed: true }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, accountType } = body

    if (!email || !accountType) {
      return NextResponse.json(
        { error: 'Email and account type are required' },
        { status: 400 }
      )
    }

    if (accountType !== 'user' && accountType !== 'sharpener') {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      )
    }

    // Check rate limit
    const rateLimit = checkRateLimit(email)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Too many requests. Please try again in ${Math.ceil(rateLimit.retryAfter! / 60)} minutes.`,
          retryAfter: rateLimit.retryAfter 
        },
        { status: 429 }
      )
    }

    // Find user or sharpener
    let account: { email: string; firstName: string; isEmailVerified: boolean } | null = null

    if (accountType === 'user') {
      account = await prisma.user.findUnique({
        where: { email },
        select: { email: true, firstName: true, isEmailVerified: true }
      })
    } else {
      account = await prisma.sharpener.findUnique({
        where: { email },
        select: { email: true, firstName: true, isEmailVerified: true }
      })
    }

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }

    if (account.isEmailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate new verification token
    const token = randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Delete any existing tokens for this email/accountType
    await prisma.emailVerificationToken.deleteMany({
      where: { email, accountType }
    })

    // Create new verification token
    await prisma.emailVerificationToken.create({
      data: {
        email,
        token,
        accountType,
        expiresAt,
      }
    })

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`
    try {
      await sendVerificationEmail({
        email,
        firstName: account.firstName,
        accountType: accountType as 'user' | 'sharpener',
        verificationUrl,
      })
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Verification email sent successfully. Please check your inbox.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
