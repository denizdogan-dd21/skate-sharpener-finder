import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.rating.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.sharpeningMachine.deleteMany()
  await prisma.sharpenerLocation.deleteMany()
  await prisma.user.deleteMany()
  await prisma.sharpener.deleteMany()

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'jane.user@example.com',
      password: await bcrypt.hash('Password123', 12),
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '+1 617 555 0100',
      isEmailVerified: true,
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'john.customer@example.com',
      password: await bcrypt.hash('Password123', 12),
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1 617 555 0101',
      isEmailVerified: true,
    }
  })

  // Create sharpeners
  const sharpener1 = await prisma.sharpener.create({
    data: {
      email: 'john.sharpener@example.com',
      password: await bcrypt.hash('Password123', 12),
      firstName: 'John',
      lastName: 'Blade',
      phone: '+1 617 555 0200',
      bio: 'Professional skate sharpener with 15 years of experience. Specializing in hockey and figure skates.',
      isEmailVerified: true,
    }
  })

  const sharpener2 = await prisma.sharpener.create({
    data: {
      email: 'sarah.sharpener@example.com',
      password: await bcrypt.hash('Password123', 12),
      firstName: 'Sarah',
      lastName: 'Edge',
      phone: '+1 617 555 0201',
      bio: 'Expert in custom radius profiles. Fast turnaround times!',
      isEmailVerified: true,
    }
  })

  // Create locations for sharpener 1
  const location1 = await prisma.sharpenerLocation.create({
    data: {
      sharpenerId: sharpener1.sharpenerId,
      locationName: "Blade Master Pro Shop",
      streetAddress: "123 Main Street",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
    }
  })

  const location2 = await prisma.sharpenerLocation.create({
    data: {
      sharpenerId: sharpener2.sharpenerId,
      locationName: "Edge Masters",
      streetAddress: "456 Oak Avenue",
      city: "Cambridge",
      state: "MA",
      zipCode: "02138",
    }
  })

  // Create machines for location 1
  const machine1 = await prisma.sharpeningMachine.create({
    data: {
      locationId: location1.locationId,
      machineType: "Blademaster",
      radiusOptions: "1/2, 5/8, 3/4, 7/8, 1",
    }
  })

  const machine2 = await prisma.sharpeningMachine.create({
    data: {
      locationId: location1.locationId,
      machineType: "Sparx Sharpener",
      radiusOptions: "1/2, 5/8, 3/4",
    }
  })

  // Create machines for location 2
  const machine3 = await prisma.sharpeningMachine.create({
    data: {
      locationId: location2.locationId,
      machineType: "Blademaster",
      radiusOptions: "1/2, 5/8, 3/4, 1",
    }
  })

  // Create availabilities for the next 7 days
  const today = new Date()
  const availabilities = []

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    // Morning slot
    const avail1 = await prisma.availability.create({
      data: {
        locationId: location1.locationId,
        machineId: machine1.machineId,
        availableDate: date,
        startTime: "09:00",
        endTime: "10:00",
        price: 15.00,
      }
    })
    availabilities.push(avail1)

    // Afternoon slot
    const avail2 = await prisma.availability.create({
      data: {
        locationId: location1.locationId,
        machineId: machine2.machineId,
        availableDate: date,
        startTime: "14:00",
        endTime: "15:00",
        price: 20.00,
      }
    })
    availabilities.push(avail2)

    // Location 2 availability
    const avail3 = await prisma.availability.create({
      data: {
        locationId: location2.locationId,
        machineId: machine3.machineId,
        availableDate: date,
        startTime: "10:00",
        endTime: "11:00",
        price: 18.00,
      }
    })
    availabilities.push(avail3)
  }

  // Create a confirmed appointment
  const appointment1 = await prisma.appointment.create({
    data: {
      userId: user1.userId,
      sharpenerId: sharpener1.sharpenerId,
      locationId: location1.locationId,
      machineId: machine1.machineId,
      availabilityId: availabilities[0].availabilityId,
      requestedDate: availabilities[0].availableDate,
      startTime: availabilities[0].startTime,
      endTime: availabilities[0].endTime,
      status: 'CONFIRMED',
      notes: 'Please sharpen with 5/8 radius',
    }
  })

  // Create a rating for the confirmed appointment
  const rating1 = await prisma.rating.create({
    data: {
      appointmentId: appointment1.appointmentId,
      userId: user1.userId,
      sharpenerId: sharpener1.sharpenerId,
      rating: 5,
      comment: 'Excellent service! My skates have never felt better.',
    }
  })

  // Update sharpener's average rating
  await prisma.sharpener.update({
    where: { sharpenerId: sharpener1.sharpenerId },
    data: {
      averageRating: 5.0,
      totalRatings: 1,
    }
  })

  // Create a pending appointment
  const appointment2 = await prisma.appointment.create({
    data: {
      userId: user2.userId,
      sharpenerId: sharpener2.sharpenerId,
      locationId: location2.locationId,
      machineId: machine3.machineId,
      availabilityId: availabilities[10].availabilityId,
      requestedDate: availabilities[10].availableDate,
      startTime: availabilities[10].startTime,
      endTime: availabilities[10].endTime,
      status: 'PENDING',
      notes: 'First time customer',
    }
  })

  // Create empty rating entry for pending appointment
  await prisma.rating.create({
    data: {
      appointmentId: appointment2.appointmentId,
      userId: user2.userId,
      sharpenerId: sharpener2.sharpenerId,
      rating: 0,
      comment: '',
    }
  })

  // Mark that availability as booked
  await prisma.availability.update({
    where: { availabilityId: availabilities[10].availabilityId },
    data: { isBooked: true }
  })

  console.log('Seed completed successfully!')
  console.log('\nSample accounts:')
  console.log('User: jane.user@example.com / Password123')
  console.log('User: john.customer@example.com / Password123')
  console.log('Sharpener: john.sharpener@example.com / Password123')
  console.log('Sharpener: sarah.sharpener@example.com / Password123')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
