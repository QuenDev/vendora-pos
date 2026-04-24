import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'
import { usersRepository } from './users.repository'
import { CreateUserInput, UpdateUserInput } from './users.schema'

export const usersService = {
  getAll: async (params: {
    page: number
    limit: number
    role?: Role
    isActive?: boolean
  }) => {
    return usersRepository.findAll(params)
  },

  getById: async (id: string) => {
    const user = await usersRepository.findById(id)
    if (!user) throw new Error('User not found')
    return user
  },

  create: async (data: CreateUserInput) => {
    const existing = await usersRepository.findByEmail(data.email)
    if (existing) throw new Error('Email already in use')

    const hashedPassword = await bcrypt.hash(data.password, 12)
    return usersRepository.create({ ...data, password: hashedPassword })
  },

  update: async (id: string, data: UpdateUserInput, requesterId: string, requesterRole: Role) => {
    const user = await usersRepository.findById(id)
    if (!user) throw new Error('User not found')

    if (requesterRole !== Role.ADMIN && requesterId !== id) {
      throw new Error('Access denied')
    }

    if (data.role && requesterRole !== Role.ADMIN) {
      throw new Error('Only admins can change roles')
    }

    if (data.email && data.email !== user.email) {
      const existing = await usersRepository.findByEmail(data.email)
      if (existing) throw new Error('Email already in use')
    }

    return usersRepository.update(id, data)
  },

  delete: async (id: string, requesterId: string) => {
    if (id === requesterId) throw new Error('You cannot deactivate your own account')

    const user = await usersRepository.findById(id)
    if (!user) throw new Error('User not found')

    return usersRepository.delete(id)
  },
}