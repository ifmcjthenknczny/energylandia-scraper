import { dayOfWeekSchema, daySchema, hourSchema } from '@/app/utils/schema'

import { Filter } from '@/app/types'
import { NextResponse } from 'next/server'
import { getAvailabilityByAttraction } from '@/app/client/collections/attractionWaitingTime'
import { getQueryParams } from '../../../../../helpers/query'
import { validate } from '@/app/utils/validate'
import { z } from 'zod'

const schema = z
    .object({
        dayFrom: daySchema.optional(),
        dayTo: daySchema.optional(),
        hourFrom: hourSchema.optional(),
        hourTo: hourSchema.optional(),
        dayOfWeek: dayOfWeekSchema.optional(),
    })
    .optional()

export async function GET(req: Request) {
    const query = getQueryParams(req)
    const filters = validate<Filter | undefined>(query, schema)
    const stats = await getAvailabilityByAttraction(filters)
    return NextResponse.json(stats)
}
