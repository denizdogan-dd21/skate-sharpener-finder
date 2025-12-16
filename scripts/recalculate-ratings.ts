import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function recalculateAllRatings() {
  console.log('Recalculating all sharpener ratings...');
  
  // Get all sharpeners
  const sharpeners = await prisma.user.findMany({
    where: {
      userType: 'SHARPENER'
    }
  });

  console.log(`Found ${sharpeners.length} sharpeners`);

  for (const sharpener of sharpeners) {
    // Get all ratings for this sharpener that are not null
    const allRatings = await prisma.rating.findMany({
      where: {
        sharpenerId: sharpener.userId,
        rating: { not: null }
      }
    });

    const totalRatings = allRatings.length;
    const averageRating = totalRatings > 0
      ? allRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRatings
      : 0;

    // Update sharpener
    await prisma.user.update({
      where: { userId: sharpener.userId },
      data: {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalRatings
      }
    });

    console.log(`Updated sharpener ${sharpener.userId}: ${totalRatings} ratings, avg ${averageRating.toFixed(1)}`);
  }

  console.log('Recalculation complete!');
}

recalculateAllRatings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
