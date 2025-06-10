import { prisma } from '../lib/prisma';
import Razorpay from 'razorpay';

async function testRazorpayIntegration() {
  try {
    // 1. Test database connection and plans
    console.log('Testing database connection...');
    const plans = await prisma.plan.findMany();
    console.log('Available plans in database:', plans.map(p => ({
      name: p.name,
      razorpayPlanId: p.razorpayPlanId
    })));

    // 2. Test Razorpay connection
    console.log('\nTesting Razorpay connection...');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 3. List all Razorpay plans
    console.log('\nFetching Razorpay plans...');
    const razorpayPlans = await razorpay.plans.all();
    console.log('Available plans in Razorpay:', razorpayPlans.items.map(p => ({
      id: p.id,
      item: p.item.name,
      amount: p.item.amount
    })));

    // 4. Test creating a subscription
    console.log('\nTesting subscription creation...');
    const testPlanId = plans[0].razorpayPlanId;
    console.log('Using plan ID:', testPlanId);
    
    const subscription = await razorpay.subscriptions.create({
      plan_id: testPlanId,
      customer_notify: 1,
      total_count: 1, // Just for testing
      notes: {
        test: true,
      },
    });
    console.log('Test subscription created:', subscription);

    // 5. Clean up test subscription
    console.log('\nCleaning up test subscription...');
    await razorpay.subscriptions.cancel(subscription.id);
    console.log('Test subscription cancelled');

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testRazorpayIntegration(); 