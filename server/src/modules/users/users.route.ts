import { Router } from 'express'
import { usersController } from './users.controller'
import { validate } from '../../middleware/validate.middleware'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from './users.schema'

const router = Router()

router.use(authenticate)

router.get('/', authorize('ADMIN', 'MANAGER'),
usersController.getAll
)

router.get('/:id',
  validate(userIdSchema),
  usersController.getById
)

router.post(
  '/',
  authorize('ADMIN'),
  validate(createUserSchema),
  usersController.create
)

router.patch(
  '/:id',
  validate(updateUserSchema),
  usersController.update
)

router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(userIdSchema),
  usersController.delete
)

export default router