import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.enum(['ADMIN', 'MANAGER', 'CASHIER']).optional(),
    locationId: z.string().optional(),
  }),
})

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
    body: z.object({
    email: z.string().email('Invalid email').optional(),
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'CASHIER']).optional(),
    locationId: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
})

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
})

export const getUsersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => (val ? parseInt(val) : 1)),
    limit: z.string().optional().transform(val => (val ? parseInt(val) : 10)),
    role: z.enum(['ADMIN', 'MANAGER', 'CASHIER']).optional(),
    isActive: z.string().optional().transform(val => {
      if (val === 'true') return true
      if (val === 'false') return false
      return undefined
    }),
  }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>['body']
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body']
