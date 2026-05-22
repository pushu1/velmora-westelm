import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, email, phone, name } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if Razorpay keys are configured
    if (!keyId || !keySecret) {
      console.warn('⚠️ Razorpay credentials not found in env. Initializing a premium test-simulated checkout order.');
      // Return a simulated order for smooth testing
      return NextResponse.json({
        id: `order_mock_${Math.random().toString(36).substring(2, 11)}`,
        amount: Math.round(amount * 100), // convert to paise
        currency: 'INR',
        isMock: true,
        keyId: 'rzp_test_mockkey123', // dummy key for script trigger
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Math.random().toString(36).substring(2, 9)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      isMock: false,
      keyId: keyId,
    });
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);
    return NextResponse.json({ error: error.message || 'Payment initialization failed' }, { status: 500 });
  }
}
