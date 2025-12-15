import crypto from 'crypto'
import { prisma } from './prisma'
import { sendEmail } from './email'

type UserType = 'CUSTOMER' | 'SHARPENER' | 'ADMIN'

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString()
}

/**
 * Create and send OTP token via email
 */
export async function createAndSendOTP(email: string, userType: UserType): Promise<boolean> {
  try {
    // Delete any existing unused tokens for this email/userType
    await prisma.twoFactorToken.deleteMany({
      where: {
        email,
        userType,
        used: false,
      },
    })

    // Generate new OTP
    const token = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save to database
    await prisma.twoFactorToken.create({
      data: {
        email,
        userType,
        token,
        expiresAt,
      },
    })

    // Send email
    const subject = 'Your Login Code - Skate Sharpener Connection'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Verification Code</h2>
        <p>Enter this code to complete your login:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
          ${token}
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `

    await sendEmail(email, subject, html)
    
    // Log OTP in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🔐 OTP CODE FOR DEVELOPMENT')
      console.log('Email:', email)
      console.log('User Type:', userType)
      console.log('Code:', token)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    }
    
    return true
  } catch (error) {
    console.error('Error creating/sending OTP:', error)
    return false
  }
}

/**
 * Verify OTP token
 */
export async function verifyOTP(
  email: string,
  userType: UserType,
  token: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const otpRecord = await prisma.twoFactorToken.findFirst({
      where: {
        email,
        userType,
        token,
        used: false,
      },
    })

    if (!otpRecord) {
      return { valid: false, error: 'Invalid or expired code' }
    }

    // Check if expired
    if (otpRecord.expiresAt < new Date()) {
      return { valid: false, error: 'Code has expired' }
    }

    // Mark as used
    await prisma.twoFactorToken.update({
      where: { tokenId: otpRecord.tokenId },
      data: { used: true },
    })

    return { valid: true }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { valid: false, error: 'Verification failed' }
  }
}

/**
 * Clean up expired OTP tokens (run periodically)
 */
export async function cleanupExpiredOTPs() {
  await prisma.twoFactorToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}
