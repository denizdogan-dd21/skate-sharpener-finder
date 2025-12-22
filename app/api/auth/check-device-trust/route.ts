import { NextRequest, NextResponse } from 'next/server'

/**
 * Debug endpoint to check device trust status
 * Only available in development mode
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const deviceToken = request.cookies.get('device_trusted')?.value

    if (!deviceToken) {
      return NextResponse.json({
        hasCookie: false,
        message: 'No device_trusted cookie found',
      })
    }

    const trustedDevices: Record<string, number> = JSON.parse(
      Buffer.from(deviceToken, 'base64').toString('utf-8')
    )

    const oneEightyDaysInMs = 180 * 24 * 60 * 60 * 1000
    const now = Date.now()

    const deviceStatus = Object.entries(trustedDevices).map(([account, timestamp]) => {
      const daysAgo = Math.floor((now - timestamp) / (24 * 60 * 60 * 1000))
      const isValid = now - timestamp < oneEightyDaysInMs
      return {
        account,
        trustedSince: new Date(timestamp).toISOString(),
        daysAgo,
        isValid,
      }
    })

    return NextResponse.json({
      hasCookie: true,
      totalDevices: Object.keys(trustedDevices).length,
      devices: deviceStatus,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to parse cookie',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
