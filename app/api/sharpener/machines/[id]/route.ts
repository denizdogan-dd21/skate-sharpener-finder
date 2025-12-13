import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Update machine
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const machineId = parseInt(params.id)
    const body = await request.json()
    const { machineType, radiusOptions, sharpenerId } = body

    // Verify ownership through location
    const existingMachine = await prisma.sharpeningMachine.findUnique({
      where: { machineId },
      include: {
        location: true
      }
    })

    if (!existingMachine) {
      return NextResponse.json(
        { error: 'Machine not found' },
        { status: 404 }
      )
    }

    if (existingMachine.location.sharpenerId !== sharpenerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updatedMachine = await prisma.sharpeningMachine.update({
      where: { machineId },
      data: {
        machineType,
        radiusOptions,
      }
    })

    return NextResponse.json({ machine: updatedMachine })
  } catch (error) {
    console.error('Update machine error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete machine
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const machineId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const sharpenerId = parseInt(searchParams.get('sharpenerId') || '0')

    if (!sharpenerId) {
      return NextResponse.json(
        { error: 'Sharpener ID required' },
        { status: 400 }
      )
    }

    // Verify ownership through location
    const existingMachine = await prisma.sharpeningMachine.findUnique({
      where: { machineId },
      include: {
        location: true
      }
    })

    if (!existingMachine) {
      return NextResponse.json(
        { error: 'Machine not found' },
        { status: 404 }
      )
    }

    if (existingMachine.location.sharpenerId !== sharpenerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete related data explicitly for better control
    // 1. Delete appointments for this machine
    await prisma.appointment.deleteMany({
      where: { machineId }
    })

    // 2. Delete availability slots for this machine
    await prisma.availability.deleteMany({
      where: { machineId }
    })

    // 3. Finally delete the machine
    await prisma.sharpeningMachine.delete({
      where: { machineId }
    })

    return NextResponse.json({ message: 'Machine deleted successfully' })
  } catch (error) {
    console.error('Delete machine error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
