import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number
    email: string
    firstName: string
    lastName: string
    phone: string
    accountType: 'user' | 'sharpener'
  }
}

/**
 * Middleware to protect API routes requiring authentication
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - Please sign in' },
      { status: 401 }
    )
  }

  // Attach user to request
  const authenticatedRequest = request as AuthenticatedRequest
  authenticatedRequest.user = {
    id: token.id as number,
    email: token.email as string,
    firstName: token.firstName as string,
    lastName: token.lastName as string,
    phone: token.phone as string,
    accountType: token.accountType as 'user' | 'sharpener',
  }

  return handler(authenticatedRequest)
}

/**
 * Middleware to ensure only users can access an endpoint
 */
export async function withUserAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(request, async (req) => {
    if (req.user?.accountType !== 'user') {
      return NextResponse.json(
        { error: 'Forbidden - User account required' },
        { status: 403 }
      )
    }
    return handler(req)
  })
}

/**
 * Middleware to ensure only sharpeners can access an endpoint
 */
export async function withSharpenerAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(request, async (req) => {
    if (req.user?.accountType !== 'sharpener') {
      return NextResponse.json(
        { error: 'Forbidden - Sharpener account required' },
        { status: 403 }
      )
    }
    return handler(req)
  })
}

/**
 * Middleware to verify resource ownership
 */
export async function withResourceOwnership(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options: {
    idParam?: string
    checkOwnership: (userId: number, accountType: 'user' | 'sharpener', resourceId: number) => Promise<boolean>
  }
) {
  return withAuth(request, async (req) => {
    const { idParam = 'id', checkOwnership } = options
    const resourceId = parseInt(req.nextUrl.pathname.split('/').pop() || '0')

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      )
    }

    const isOwner = await checkOwnership(req.user!.id, req.user!.accountType, resourceId)
    
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this resource' },
        { status: 403 }
      )
    }

    return handler(req)
  })
}
