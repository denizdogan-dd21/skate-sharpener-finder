import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { UserType } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      email: string
      firstName: string
      lastName: string
      phone: string
      accountType: 'user' | 'sharpener' | 'admin'
      userType: UserType
    }
  }

  interface User {
    id: number
    email: string
    firstName: string
    lastName: string
    phone: string
    accountType: 'user' | 'sharpener' | 'admin'
    userType: UserType
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    accountType: 'user' | 'sharpener' | 'admin'
    userType: UserType
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
        skipPasswordCheck: { label: 'Skip Password Check', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.accountType) {
          throw new Error('Missing credentials')
        }

        // Map accountType to UserType
        let userType: UserType
        if (credentials.accountType === 'user') {
          userType = 'CUSTOMER'
        } else if (credentials.accountType === 'sharpener') {
          userType = 'SHARPENER'
        } else if (credentials.accountType === 'admin') {
          userType = 'ADMIN'
        } else {
          throw new Error('Invalid account type')
        }

        try {
          // If skipPasswordCheck is set, it means OTP was already verified
          // Just fetch the user and create session
          if (credentials.skipPasswordCheck === 'true') {
            const user = await prisma.user.findUnique({
              where: {
                email_userType: {
                  email: credentials.email,
                  userType,
                },
              },
            })

            if (!user) {
              throw new Error('User not found')
            }

            return {
              id: user.userId,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              accountType: credentials.accountType as 'user' | 'sharpener' | 'admin',
              userType: user.userType,
            }
          }

          // This shouldn't happen in the new flow, but keeping for backward compatibility
          throw new Error('Please use the login page')
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
        token.userType = user.userType
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
          userType: token.userType,
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
