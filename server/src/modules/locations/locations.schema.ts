import { z } from 'zod'

export const createLocationSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        address: z.string().min(1, 'Address is required'),
        phone: z.string().min(1, 'Phone is required'),
    }),
})

export const updateLocationSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Location ID is required'),
    }),
    body: z.object({
        name: z.string().min(1, 'Name is required').optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        isActive: z.boolean().optional(),
    })
})

export const locationIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Location ID is required'),
    }),
})

export type CreateLocationInput = z.infer<typeof createLocationSchema>['body']
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>['body']