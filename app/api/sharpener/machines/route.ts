import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Create machine
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { locationId, machineType, radiusOptions } = body

    if (!locationId || !machineType || !radiusOptions) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const machine = await prisma.sharpeningMachine.create({
      data: {
        locationId,
        machineType,
        radiusOptions,
      }
    })

    return NextResponse.json(
      {
        message: 'Machine created successfully',
        machine,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create machine error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get machines
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')

    if (!locationId) {
      return NextResponse.json(
        { error: 'locationId is required' },
        { status: 400 }
      )
    }

    const machines = await prisma.sharpeningMachine.findMany({
      where: { 
        locationId: parseInt(locationId),
        isActive: true 
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ machines })
  } catch (error) {
    console.error('Get machines error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
