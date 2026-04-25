import { Request, Response } from 'express'
import { locationsService } from './locations.service'
import { sendSuccess, sendError } from '../../utils/response.util'

export const locationsController = {
    getAll: async (_req: Request, res: Response ) => {
        try {
            const locations = await locationsService.getAll()
            return sendSuccess (res, locations, 'Location Retrieved')
        } catch (error) {
            const message = error instanceof Error? error.message: 'Failed to get location'
            return sendError(res, message, 500)
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const location = await locationsService.getById(req.params.id as string)
            return sendSuccess(res, location, 'Location Retrieved')
        } catch (error) {
            const message = error instanceof Error? error.message: 'Failed to get location'
            const status = message === 'Location not found' ? 404 : 500
            return sendError(res, message, status)
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const location = await locationsService.create(req.body)
            return sendSuccess(res, location, 'Location Created', 201)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create location'
            return sendError(res, message, 500)
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const location = await locationsService.update(req.params.id as string, req.body)
            return sendSuccess(res, location, 'Location updated')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update location'
            const status = message === 'Location not found' ? 404 : 500
            return sendError(res, message, status)
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const location = await.locationsService.delete(req.params.id as string)
            return sendSuccess(res, location, 'Location Deactivated')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to deactivate location'
            const status = message === 'Location not found' ? 404 : 500
            return sendError(res, message, status)
        }
    },


}