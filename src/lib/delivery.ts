import { createHmac } from 'crypto'
import { z } from 'zod'
import { deliveryRequestSchema } from '@/lib/validations'

export type DeliveryRequest = z.infer<typeof deliveryRequestSchema>

type DeliveryResult = {
  job: { id: string; status: string }
  duplicate?: boolean
}

function getDeliveryConfig() {
  const secret = process.env.DELIVERY_INTEGRATION_SECRET?.trim()
  const apiUrl = (process.env.DELIVERY_API_URL || 'https://api.sovdigitalgroup.com').trim().replace(/\/$/, '')
  if (!secret || !apiUrl) return null
  return { secret, apiUrl }
}

export async function createShop868DeliveryRequest(input: DeliveryRequest): Promise<DeliveryResult> {
  const config = getDeliveryConfig()
  if (!config) throw new Error('Delivery integration is not configured')

  const request = deliveryRequestSchema.parse(input)
  const payload = JSON.stringify({
    external_reference: request.orderId,
    customer_name: request.customerName,
    customer_phone: request.customerPhone,
    merchant_name: request.merchantName || 'Shop868',
    pickup_zone_id: request.pickupZoneId,
    dropoff_zone_id: request.dropoffZoneId,
    pickup_address: request.pickupAddress,
    dropoff_address: request.dropoffAddress,
    instructions: request.instructions,
  })
  const timestamp = String(Date.now())
  const signature = createHmac('sha256', config.secret).update(`${timestamp}.${payload}`).digest('hex')
  const response = await fetch(`${config.apiUrl}/api/delivery/integrations/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-delivery-merchant': 'shop868',
      'x-delivery-timestamp': timestamp,
      'x-delivery-signature': `sha256=${signature}`,
      'idempotency-key': `shop868:${request.orderId}`,
    },
    body: payload,
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Delivery request was rejected')
  return response.json() as Promise<DeliveryResult>
}
