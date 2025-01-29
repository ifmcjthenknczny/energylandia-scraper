import { dayOfWeekSchema, daySchema, hourSchema } from '@/utils/schema'

import { Filter } from '@/types'
import { NextResponse } from 'next/server'
import { getAvailabilityByAttraction } from '@/client/collections/attractionWaitingTime'
import { getQueryParams } from '../../../../utils/query'
import { validate } from '@/utils/validate'
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
