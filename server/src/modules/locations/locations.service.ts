import { locationsRepository } from "./locations.repository";
import { CreateLocationInput, UpdateLocationInput } from "./locations.schema";

export const locationsService = {
    getAll: async () => {
        return locationsRepository.findAll()
    },

    getById: async (id: string) => {
        const location = await locationsRepository.findById(id)
        if (!location) throw new Error("Location not found")
        return location
    },

    create: async (data: CreateLocationInput) => {
        return locationsRepository.create(data)
    },

    update: async (id: string, data: UpdateLocationInput) => {
        const location = await locationsRepository.findById(id)
        if (!location) throw new Error("Location not found")
        return locationsRepository.update(id, data)
    },

    delete: async (id: string) => {
        const location = await locationsRepository.findById(id)
        if (!location) throw new Error("Location not found")
        return locationsRepository.delete(id)
    }
}