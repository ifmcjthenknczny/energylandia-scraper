import { dayOfWeekSchema, daySchema } from '@/utils/schema'

import { Filter } from '@/types'
import { NextResponse } from 'next/server'
import { findOverallAvgWaitingTimeByHour } from '@/client/collections/attractionWaitingTime'
import { getQueryParams } from '../../../../../utils/query'
import { validate } from '@/utils/validate'
import { z } from 'zod'

const schema = z
    .object({
        dayFrom: daySchema.optional(),
        dayTo: daySchema.optional(),
        dayOfWeek: dayOfWeekSchema.optional(),
    })
    .optional()

export async function GET(req: Request) {
    const query = getQueryParams(req)
    const filters = validate<Filter | undefined>(query, schema)
    const stats = await findOverallAvgWaitingTimeByHour(filters)
    return NextResponse.json(stats)
}
