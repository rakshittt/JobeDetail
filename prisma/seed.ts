import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_PLANS } from '../lib/plan';

const prisma = new PrismaClient();

async function main() {
  // Create plans
  for (const plan of SUBSCRIPTION_PLANS) {
    await prisma.plan.upsert({
      where: { razorpayPlanId: plan.razorpayPlanId },
      update: {
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
        features: [...plan.features],
      },
      create: {
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
        features: [...plan.features],
        razorpayPlanId: plan.razorpayPlanId,
      },
    });
  }

  console.log('✅ Plans seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 