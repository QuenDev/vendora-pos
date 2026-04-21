import { Request, Response } from 'express'
import { authService } from './auth.service'
import { sendSuccess, sendError } from '../../utils/response.util'

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const result = await authService.register(req.body)
      return sendSuccess(res, result, 'Registration successful', 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      return sendError(res, message, 400)
    }
  },

    login: async (req: Request, res: Response) => {
    try {
      const result = await authService.login(req.body)
      return sendSuccess(res, result, 'Login successful')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      return sendError(res, message, 401)
    }
  },

   refresh: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body
      const result = await authService.refresh(refreshToken)
      return sendSuccess(res, result, 'Token refreshed')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token refresh failed'
      return sendError(res, message, 401)
    }
  },

    logout: async (req: Request, res: Response) => {
    try {
      await authService.logout(req.user!.id)
      return sendSuccess(res, null, 'Logged out successfully')
    } catch {
      return sendError(res, 'Logout failed', 500)
    }
  },

  me: async (req: Request, res: Response) => {
    try {
      return sendSuccess(res, req.user, 'User retrieved')
    } catch {
      return sendError(res, 'Failed to get user', 500)
    }
  },
}