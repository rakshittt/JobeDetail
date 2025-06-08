import { NextRequest, NextResponse } from 'next/server';
import { razorpayInstance } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();

    // Get user and plan
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!user || !plan) {
      return NextResponse.json({ error: 'User or plan not found' }, { status: 404 });
    }

    // Create Razorpay customer
    const customer = await razorpayInstance.customers.create({
      name: user.name || 'Customer',
      email: user.email,
      contact: '', // Add phone if available
    });

    // Create Razorpay subscription
    const subscription = await razorpayInstance.subscriptions.create({
      plan_id: plan.razorpayPlanId!,
      customer_notify: 1,
      quantity: 1,
      total_count: 12, // 12 months
      start_at: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // Start tomorrow
    });

    // Save subscription in database
    const dbSubscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: 'INACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        razorpaySubscriptionId: subscription.id,
        razorpayCustomerId: customer.id,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      dbSubscriptionId: dbSubscription.id,
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}