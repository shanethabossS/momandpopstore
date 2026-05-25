import { NextRequest, NextResponse } from 'next/server';
import { getFygaroEnvConfig, getFygaroPaymentLinkUrl } from '@/lib/payments/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, currency, description, customer, returnUrl, cancelUrl } = body;
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || '';

    // --- Strategy 1: Full Fygaro API (if env vars configured) ---
    const fygaro = getFygaroEnvConfig();
    if (fygaro) {
      const res = await fetch(`${fygaro.apiBaseUrl}/payment-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${fygaro.apiKey}`,
        },
        body: JSON.stringify({
          merchant_id: fygaro.merchantId,
          amount: amount,
          currency: currency || 'TTD',
          description: description || `Mom & Pop Store order ${orderId}`,
          reference: `mps_${orderId}_${Date.now()}`,
          success_url: `${origin}${returnUrl || '/orders'}`,
          cancel_url: `${origin}${cancelUrl || '/stores'}`,
          webhook_url: `${origin}/api/payments/fygaro`,
          customer_email: customer?.email,
          customer_name: customer?.name,
          customer_phone: customer?.phone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ checkoutUrl: data.payment_url || data.checkout_url || data.url });
      }
      console.error('Fygaro API error, falling back to payment link:', await res.text());
    }

    // --- Strategy 2: Fygaro Payment Link redirect (works immediately) ---
    const linkBase = getFygaroPaymentLinkUrl();
    const amountTTD = typeof amount === 'number' && amount > 0 ? (amount / 100).toFixed(2) : '';
    const label = description || `Mom & Pop Store - Order ${orderId || 'checkout'}`;
    const params = new URLSearchParams();
    if (amountTTD) params.set('amount', amountTTD);
    if (label) params.set('description', label);
    const separator = linkBase.includes('?') ? '&' : '?';
    const checkoutUrl = `${linkBase}${separator}${params.toString()}`;

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error('Fygaro payment route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
