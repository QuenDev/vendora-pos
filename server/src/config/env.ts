type JwtExpiry = `${number}${'s' | 'm' | 'h' | 'd'}`

const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}


export const env = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    jwt: {
       accessSecret: requireEnv('JWT_ACCESS_SECRET'),
       refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
       accessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as JwtExpiry,
       refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as JwtExpiry,
    },
}