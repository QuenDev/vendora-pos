import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/users/users.route'
import locationsRoutes from './modules/locations/locations.routes'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.clientUrl }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.nodeEnv })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/locations', locationsRoutes)


export default app