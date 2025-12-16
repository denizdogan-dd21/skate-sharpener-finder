import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRatings() {
  // Check all ratings
  const ratings = await prisma.rating.findMany({
    include: {
      appointment: {
        select: {
          appointmentId: true,
          status: true
        }
      }
    }
  });

  console.log('\n=== All Ratings ===');
  console.log(JSON.stringify(ratings, null, 2));

  // Check sharpeners
  const sharpeners = await prisma.user.findMany({
    where: {
      userType: 'SHARPENER'
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      averageRating: true,
      totalRatings: true
    }
  });

  console.log('\n=== Sharpeners ===');
  console.log(JSON.stringify(sharpeners, null, 2));
}

checkRatings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
