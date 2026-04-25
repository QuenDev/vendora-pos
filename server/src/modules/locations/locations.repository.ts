import { prisma } from "../../database/prisma.client"
import type { CreateLocationInput, UpdateLocationInput } from './locations.schema'

export const locationsRepository = {
    findAll: async () => {
        return prisma.location.findMany({
            where: { isActive: true},
            orderBy: { createdAt: 'desc'},
        })
    },

    findById: async (id: string) => {
        return prisma.location.findUnique({
            where: { id },
        })
    },

  create: async (data: CreateLocationInput ) => {
      return prisma.location.create ({
        data: {
            name: data.name,
            address: data.address,
            phone: data.phone,
        },
      })
    },
  update: async (id: string, data: UpdateLocationInput) => {
    return prisma.location.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })
  },

  delete: async (id: string) => {
    return prisma.location.update({
      where: { id },
      data: { isActive: false },
    })
  },
}
