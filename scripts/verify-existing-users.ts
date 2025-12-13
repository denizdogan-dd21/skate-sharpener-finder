import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyExistingUsers() {
  console.log('🔍 Finding unverified users and sharpeners...\n')

  // Get unverified users
  const unverifiedUsers = await prisma.user.findMany({
    where: { isEmailVerified: false },
    select: { userId: true, email: true, firstName: true, lastName: true }
  })

  // Get unverified sharpeners
  const unverifiedSharpeners = await prisma.sharpener.findMany({
    where: { isEmailVerified: false },
    select: { sharpenerId: true, email: true, firstName: true, lastName: true }
  })

  console.log(`Found ${unverifiedUsers.length} unverified users`)
  console.log(`Found ${unverifiedSharpeners.length} unverified sharpeners\n`)

  if (unverifiedUsers.length === 0 && unverifiedSharpeners.length === 0) {
    console.log('✅ All users are already verified!')
    return
  }

  // Verify all users
  if (unverifiedUsers.length > 0) {
    console.log('Verifying users:')
    const userResult = await prisma.user.updateMany({
      where: { isEmailVerified: false },
      data: { isEmailVerified: true }
    })
    console.log(`✅ Verified ${userResult.count} users`)
    unverifiedUsers.forEach(u => console.log(`   - ${u.email} (${u.firstName} ${u.lastName})`))
    console.log()
  }

  // Verify all sharpeners
  if (unverifiedSharpeners.length > 0) {
    console.log('Verifying sharpeners:')
    const sharpenerResult = await prisma.sharpener.updateMany({
      where: { isEmailVerified: false },
      data: { isEmailVerified: true }
    })
    console.log(`✅ Verified ${sharpenerResult.count} sharpeners`)
    unverifiedSharpeners.forEach(s => console.log(`   - ${s.email} (${s.firstName} ${s.lastName})`))
    console.log()
  }

  // Clean up any orphaned verification tokens
  const deletedTokens = await prisma.emailVerificationToken.deleteMany({})
  if (deletedTokens.count > 0) {
    console.log(`🧹 Cleaned up ${deletedTokens.count} unused verification tokens\n`)
  }

  console.log('✨ All existing users are now verified!')
}

verifyExistingUsers()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
