import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderNumber, paymentMethod, paymentType } = body;

    if (!orderNumber || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderData: any = await kv.get(`order:${orderNumber}`);
    if (!orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    if (!xenditSecretKey) {
      console.error('Missing Xendit Secret Key');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const authHeader = `Basic ${Buffer.from(xenditSecretKey + ':').toString('base64')}`;

    if (paymentType === 'VA') {
      // Create Fixed Virtual Account
      const xenditResponse = await fetch('https://api.xendit.co/v2/virtual_accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          external_id: `VA-${orderNumber}-${Date.now()}`, // Unique external ID for VA
          bank_code: paymentMethod, // BCA, BNI, MANDIRI, etc.
          name: orderData.customer.name,
          expected_amount: orderData.total,
          is_single_use: true,
          is_closed: true
        })
      });

      const xenditData = await xenditResponse.json();

      if (!xenditResponse.ok) {
        console.error('Xendit VA Error:', xenditData);
        // Fallback for prototyping if Xendit fails (e.g. invalid bank code for sandbox)
        return NextResponse.json({ 
          type: 'VA', 
          account_number: `890${Math.floor(Math.random() * 1000000000)}` 
        });
      }

      return NextResponse.json({
        type: 'VA',
        account_number: xenditData.account_number,
        id: xenditData.id
      });
    } else if (paymentType === 'QRIS') {
      // Generate QR Code
      const xenditResponse = await fetch('https://api.xendit.co/qr_codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'api-version': '2022-07-31'
        },
        body: JSON.stringify({
          reference_id: `QR-${orderNumber}-${Date.now()}`,
          type: 'DYNAMIC',
          currency: 'IDR',
          amount: orderData.total,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
      });

      const xenditData = await xenditResponse.json();

      if (!xenditResponse.ok) {
        console.error('Xendit QRIS Error:', xenditData);
        // Fallback
        return NextResponse.json({ 
          type: 'QRIS', 
          qr_string: '00020101021126670016COM.GO-JEK.WWW01189360091431604184690214151703673295090303UME51440014ID.CO.QRIS.WWW0215ID10200210080350303UME52045499530336054061800005802ID5919Auraskin Store6013Jakarta Pusat61051011062070703A016304D1B9'
        });
      }

      return NextResponse.json({
        type: 'QRIS',
        qr_string: xenditData.qr_string,
        id: xenditData.id
      });
    } else if (paymentType === 'EWALLET') {
      // Mock E-Wallet Response for Prototype
      return NextResponse.json({
        type: 'EWALLET',
        redirect_url: 'https://simulator.xendit.co/' // Usually would be GoPay/OVO deep link
      });
    } else if (paymentType === 'RETAIL') {
      // Mock Retail Outlet Response for Prototype
      return NextResponse.json({
        type: 'RETAIL',
        payment_code: `AURA${Math.floor(Math.random() * 10000000)}`
      });
    } else if (paymentType === 'CARD') {
      // Mock Credit Card Response for Prototype
      return NextResponse.json({
        type: 'CARD',
        status: 'PENDING_AUTHENTICATION'
      });
    }

    return NextResponse.json({ error: 'Unsupported payment type' }, { status: 400 });

  } catch (error) {
    console.error('Process Payment Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
