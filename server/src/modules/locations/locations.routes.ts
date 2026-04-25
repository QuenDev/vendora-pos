import { Router } from 'express'
import { locationsController } from './locations.controller'
import { validate } from '../../middleware/validate.middleware'
import { authenticate, authorize } from '../../middleware/auth.middleware'
import { createLocationSchema, updateLocationSchema, locationIdSchema } from './locations.schema'

const router = Router()

router.use(authenticate)

router.get(
  '/',
  locationsController.getAll
)

router.get(
  '/:id',
  validate(locationIdSchema),
  locationsController.getById
)


router.post(
  '/',
  authorize('ADMIN'),
  validate(createLocationSchema),
  locationsController.create
)

router.patch(
  '/:id',
  authorize('ADMIN'),
  validate(updateLocationSchema),
  locationsController.update
)

router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(locationIdSchema),
  locationsController.delete
)

export default router