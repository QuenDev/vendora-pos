import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'
import { env } from '../../config/env'
import { authRepository } from './auth.repository'
import { RegisterInput, LoginInput } from './auth.schema'

interface TokenPayload {
  id: string
  email: string
  role: Role
}

const signTokens = (payload: TokenPayload) => {
const accessToken = jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  })
    const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn 
  })
  return { accessToken, refreshToken }
}

export const authService = {
  register: async (data: RegisterInput) => {
    const existing = await authRepository.findByEmail(data.email)
    if (existing) throw new Error('Email already in use')

    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = await authRepository.create({
      ...data,
      password: hashedPassword,
    })

    const { accessToken, refreshToken } = signTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    await authRepository.updateRefreshToken(user.id, refreshToken)

    return { user, accessToken, refreshToken }
  },

  login: async (data: LoginInput) => {
    const user = await authRepository.findByEmail(data.email)
    if (!user || !user.isActive) throw new Error('Invalid credentials')

    const isMatch = await bcrypt.compare(data.password, user.password)
    if (!isMatch) throw new Error('Invalid credentials')

    const { accessToken, refreshToken } = signTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    await authRepository.updateRefreshToken(user.id, refreshToken)

    const { password: _, refreshToken: __, ...safeUser } = user
    return { user: safeUser, accessToken, refreshToken }
  },

  refresh: async (token: string) => {
    const user = await authRepository.findByRefreshToken(token)
    if (!user) throw new Error('Invalid refresh token')

    try {
      jwt.verify(token, env.jwt.refreshSecret)
    } catch {
      await authRepository.updateRefreshToken(user.id, null)
      throw new Error('Refresh token expired, please log in again')
    }

    const { accessToken, refreshToken } = signTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    await authRepository.updateRefreshToken(user.id, refreshToken)
    return { accessToken, refreshToken }
  },

  logout: async (userId: string) => {
    await authRepository.updateRefreshToken(userId, null)
  },
}