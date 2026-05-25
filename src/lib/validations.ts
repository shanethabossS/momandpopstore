import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20).optional(),
  password: z.string().min(8).max(128),
})

export const storefrontCreateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  categorySlug: z.string().optional(),
  address: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
  whatsappNumber: z.string().max(20).optional(),
  hours: z.array(z.string()).max(10).optional(),
  tags: z.array(z.string()).max(20).optional(),
})

export const storefrontUpdateSchema = storefrontCreateSchema.partial()

export const productCreateSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(500).optional(),
  price: z.number().min(0).max(999999.99),
  priceLabel: z.string().max(50).optional(),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).max(20).optional(),
  paymentType: z.enum(['fygaro', 'deposit', 'whatsapp_quote']).optional(),
  isFeatured: z.boolean().optional(),
})

export const productUpdateSchema = productCreateSchema.partial()

export const reviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

export const moderateSchema = z.object({
  action: z.enum(['approve', 'reject', 'disable', 'feature', 'unfeature']),
  reason: z.string().max(500).optional(),
})
