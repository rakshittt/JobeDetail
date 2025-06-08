// scripts/test-webhook.ts
import crypto from 'crypto';

const WEBHOOK_SECRET = 'your_webhook_secret';
const WEBHOOK_URL = 'https://jobe-detail-je1txio5w-rakshits-projects-632934b7.vercel.app/api/subscriptions/webhook';

const testPayload = {
  event: 'payment.captured',
  payload: {
    payment: {
      entity: {
        id: 'pay_test123',
        amount: 99900,
        currency: 'INR',
        status: 'captured',
        created_at: Math.floor(Date.now() / 1000)
      }
    }
  }
};

function generateSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

async function testWebhook() {
  const payloadString = JSON.stringify(testPayload);
  const signature = generateSignature(payloadString, WEBHOOK_SECRET);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Razorpay-Signature': signature,
      },
      body: payloadString,
    });
    
    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', result);
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

testWebhook();