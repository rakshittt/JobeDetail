import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload.subscription.entity);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;
      
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function handleSubscriptionActivated(subscription: any) {
  await prisma.subscription.updateMany({
    where: { razorpaySubscriptionId: subscription.id },
    data: {
      status: 'ACTIVE',
      currentPeriodStart: new Date(subscription.current_start * 1000),
      currentPeriodEnd: new Date(subscription.current_end * 1000),
    },
  });
}

async function handleSubscriptionCancelled(subscription: any) {
  await prisma.subscription.updateMany({
    where: { razorpaySubscriptionId: subscription.id },
    data: { status: 'CANCELLED' },
  });
}

async function handlePaymentCaptured(payment: any) {
  await prisma.payment.updateMany({
    where: { razorpayPaymentId: payment.id },
    data: {
      status: 'COMPLETED',
      amount: payment.amount,
    },
  });
}

async function handlePaymentFailed(payment: any) {
  await prisma.payment.updateMany({
    where: { razorpayPaymentId: payment.id },
    data: { status: 'FAILED' },
  });
}