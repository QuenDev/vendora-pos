import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'
import { env } from '../config/env'
import { sendError } from '../utils/response.util'

interface JWTPayload {
  id: string
  email: string
  role: Role
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return sendError(res, 'No token provided', 401)
    }
    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, env.jwt.accessSecret) as JWTPayload
    req.user = payload
    next()
  } catch {
    return sendError(res, 'Invalid or expired token', 401)
  }
}

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 'Access denied', 403)
    }
    next()
  }
}