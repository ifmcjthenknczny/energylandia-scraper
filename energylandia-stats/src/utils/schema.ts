import { z } from 'zod'

const daySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const hourSchema = z.string().regex(/^\d{2}:\d{2}$/)
const dayOfWeekSchema = z
    .union([z.string(), z.number()])
    .transform((val) => {
        const parsed = typeof val === 'number' ? val : Number(val)
        if (isNaN(parsed)) {
            throw new Error('Invalid number')
        }
        return parsed
    })
    .refine((val) => Number.isInteger(val) && val >= 0 && val <= 6, {
        message: 'dayOfWeek must be an integer between 0 and 6',
    })

export const filterSchema = z
    .object({
        dayFrom: daySchema.optional(),
        dayTo: daySchema.optional(),
        dayOfWeek: dayOfWeekSchema.optional(),
        hourFrom: hourSchema.optional(),
        hourTo: hourSchema.optional(),
    })
    .refine(
        ({ dayFrom, dayTo }) => {
            if (dayFrom && dayTo) {
                return dayTo > dayFrom
            }
            return true
        },
        {
            message: 'dayTo must be after dayFrom',
            path: ['dayTo'],
        },
    )
    .refine(
        ({ hourFrom, hourTo }) => {
            if (hourFrom && hourTo) {
                return hourTo > hourFrom
            }
            return true
        },
        {
            message: 'hourTo must be after hourFrom',
            path: ['hourTo'],
        },
    )
    .optional()
