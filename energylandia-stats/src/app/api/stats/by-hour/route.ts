import { dayOfWeekSchema, daySchema, hourSchema } from '@/utils/schema'

import { Filter } from '@/types'
import { NextResponse } from 'next/server'
import { findAvgWaitingTimeByAttractionAndHour } from '@/client/collections/attractionWaitingTime'
import { getQueryParams } from '../../../../utils/query'
import { validate } from '@/utils/validate'
import { z } from 'zod'

const schema = z
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

export async function GET(req: Request) {
    const query = getQueryParams(req)
    const filters = validate<Filter | undefined>(query, schema)
    const stats = await findAvgWaitingTimeByAttractionAndHour(filters)
    return NextResponse.json(stats)
}
