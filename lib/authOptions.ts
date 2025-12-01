import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { verifyPassword, validateEmail } from '@/lib/auth'
import type { User, Sharpener } from '@/types'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      email: string
      firstName: string
      lastName: string
      phone: string
      accountType: 'user' | 'sharpener'
    }
  }

  interface User {
    id: number
    email: string
    firstName: string
    lastName: string
    phone: string
    accountType: 'user' | 'sharpener'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    accountType: 'user' | 'sharpener'
    firstName: string
    lastName: string
    phone: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        accountType: { label: 'Account Type', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.accountType) {
          throw new Error('Missing credentials')
        }

        if (!validateEmail(credentials.email)) {
          throw new Error('Invalid email format')
        }

        if (credentials.accountType !== 'user' && credentials.accountType !== 'sharpener') {
          throw new Error('Invalid account type')
        }

        try {
          if (credentials.accountType === 'user') {
            const user = await prisma.user.findUnique({
              where: { email: credentials.email },
            })

            if (!user) {
              throw new Error('Invalid credentials')
            }

            const isPasswordValid = await verifyPassword(credentials.password, user.password)
            if (!isPasswordValid) {
              throw new Error('Invalid credentials')
            }

            return {
              id: user.userId,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              accountType: 'user' as const,
            }
          } else {
            const sharpener = await prisma.sharpener.findUnique({
              where: { email: credentials.email },
            })

            if (!sharpener) {
              throw new Error('Invalid credentials')
            }

            const isPasswordValid = await verifyPassword(credentials.password, sharpener.password)
            if (!isPasswordValid) {
              throw new Error('Invalid credentials')
            }

            return {
              id: sharpener.sharpenerId,
              email: sharpener.email,
              firstName: sharpener.firstName,
              lastName: sharpener.lastName,
              phone: sharpener.phone,
              accountType: 'sharpener' as const,
            }
          }
        } catch (error) {
          console.error('Authorization error:', error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as number
        token.accountType = user.accountType
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email as string,
          firstName: token.firstName,
          lastName: token.lastName,
          phone: token.phone,
          accountType: token.accountType,
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
