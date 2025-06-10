import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    console.log('Starting subscription creation process...');
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('No session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.log('User authenticated:', session.user.id);

    const { planId } = await req.json();
    console.log('Received planId:', planId);

    // Get plan details from database
    console.log('Fetching plan from database...');
    const plan = await prisma.plan.findUnique({
      where: { razorpayPlanId: planId },
    });
    console.log('Found plan:', plan);

    if (!plan || !plan.razorpayPlanId) {
      console.log('Plan not found or invalid');
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Create Razorpay subscription
    console.log('Creating Razorpay subscription...');
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.razorpayPlanId,
      customer_notify: 1,
      total_count: 12, // 12 months subscription
      notes: {
        userId: session.user.id,
        planId: plan.id,
      },
    });
    console.log('Razorpay subscription created:', subscription);

    // Create subscription in database
    console.log('Creating subscription in database...');
    const subscriptionRecord = await prisma.subscription.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        planId: plan.id,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false,
        razorpaySubscriptionId: subscription.id,
      },
      create: {
        userId: session.user.id,
        planId: plan.id,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false,
        razorpaySubscriptionId: subscription.id,
      },
    });
    console.log('Database subscription created:', subscriptionRecord);

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error) {
    console.error('Subscription creation error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 