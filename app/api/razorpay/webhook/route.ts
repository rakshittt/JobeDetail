import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload.subscription.entity);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      // Add more event handlers as needed
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionActivated(subscription: any) {
  await prisma.subscription.update({
    where: {
      razorpaySubscriptionId: subscription.id,
    },
    data: {
      status: 'ACTIVE',
      currentPeriodStart: new Date(subscription.start_at * 1000),
      currentPeriodEnd: new Date(subscription.end_at * 1000),
    },
  });
}

async function handleSubscriptionCancelled(subscription: any) {
  await prisma.subscription.update({
    where: {
      razorpaySubscriptionId: subscription.id,
    },
    data: {
      status: 'CANCELLED',
      cancelAtPeriodEnd: true,
    },
  });
}

async function handlePaymentFailed(payment: any) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      razorpaySubscriptionId: payment.subscription_id,
    },
  });

  if (subscription) {
    await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: 'PAST_DUE',
      },
    });
  }
} 