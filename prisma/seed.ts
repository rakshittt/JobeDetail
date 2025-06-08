import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_PLANS } from '../lib/plan';

const prisma = new PrismaClient();

async function main() {
  // Create plans in database
  for (const plan of SUBSCRIPTION_PLANS) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {},
      create: {
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
        features: [...plan.features],
        // You'll need to create these plans in Razorpay dashboard first
        razorpayPlanId: `plan_${plan.id}`, // Replace with actual Razorpay plan IDs
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 