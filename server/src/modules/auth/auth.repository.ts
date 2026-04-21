import { Role } from '@prisma/client'
import { prisma } from '../../database/prisma.client'
import { RegisterInput } from './auth.schema'

export const authRepository = {
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    })
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    })
  },

   findByRefreshToken: async (refreshToken: string) => {
    return prisma.user.findFirst({
      where: { refreshToken },
    })
  },

    create: async (data: RegisterInput & { password: string }) => {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: (data.role as Role) ?? Role.CASHIER,
        locationId: data.locationId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        locationId: true,
        isActive: true,
        createdAt: true,
      },
    })
  },

    updateRefreshToken: async (userId: string, refreshToken: string | null) => {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    })
  },
}