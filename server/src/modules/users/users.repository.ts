import { Role } from '@prisma/client'
import { prisma } from '../../database/prisma.client'
import { CreateUserInput, UpdateUserInput } from './users.schema'

const safeUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
  locationId: true,
  location: {
    select: {
      id: true,
      name: true,
    },
  },
  createdAt: true,
  updatedAt: true,
}

export const usersRepository = {
  findAll: async (params: {
    page: number
    limit: number
    role?: Role
    isActive?: boolean
  }) => {
    const { page, limit, role, isActive } = params
    const skip = (page - 1) * limit

    const where = {
      ...(role && { role }),
      ...(isActive !== undefined && { isActive }),
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: safeUserSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    })
  },

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      select: safeUserSelect,
    })
  },

  create: async (data: CreateUserInput & { password: string }) => {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: (data.role as Role) ?? Role.CASHIER,
        locationId: data.locationId,
      },
      select: safeUserSelect,
    })
  },

  update: async (id: string, data: UpdateUserInput) => {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.role && { role: data.role as Role }),
        ...(data.locationId !== undefined && { locationId: data.locationId }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      select: safeUserSelect,
    })
  },

  delete: async (id: string) => {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: safeUserSelect,
    })
  },
}