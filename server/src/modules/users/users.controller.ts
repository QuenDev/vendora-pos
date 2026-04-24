import { Request, Response } from 'express'
import { Role } from '@prisma/client'
import { usersService } from './users.service'
import { sendSuccess, sendError } from '../../utils/response.util'

export const usersController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { page, limit, role, isActive } = req.query as any
      const result = await usersService.getAll({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        role: role as Role | undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      })
      return sendSuccess(res, result, 'Users retrieved')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get users'
      return sendError(res, message, 500)
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const user = await usersService.getById(req.params.id as string)
      return sendSuccess(res, user, 'User retrieved')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user'
      const status = message === 'User not found' ? 404 : 500
      return sendError(res, message, status)
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const user = await usersService.create(req.body)
      return sendSuccess(res, user, 'User created', 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user'
      return sendError(res, message, 400)
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const user = await usersService.update(
        req.params.id as string,
        req.body,
        req.user!.id,
        req.user!.role
      )
      return sendSuccess(res, user, 'User updated')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user'
      const status = message === 'User not found' ? 404
        : message === 'Access denied' ? 403
        : 400
      return sendError(res, message, status)
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const user = await usersService.delete(req.params.id as string, req.user!.id)
      return sendSuccess(res, user, 'User deactivated')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user'
      const status = message === 'User not found' ? 404 : 400
      return sendError(res, message, status)
    }
  },
}