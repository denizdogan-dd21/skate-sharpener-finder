import { getServerSession } from 'next-auth/next'
import { authOptions } from './authOptions'

/**
 * Get the current session on the server side
 * Use this in Server Components and API routes
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session.user
}

/**
 * Require user account type
 */
export async function requireUserAuth() {
  const user = await requireAuth()
  if (user.accountType !== 'user') {
    throw new Error('Forbidden - User account required')
  }
  return user
}

/**
 * Require sharpener account type
 */
export async function requireSharpenerAuth() {
  const user = await requireAuth()
  if (user.accountType !== 'sharpener') {
    throw new Error('Forbidden - Sharpener account required')
  }
  return user
}
