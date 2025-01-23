import { dayOfWeekSchema, daySchema } from '@/app/utils/schema'

import { Filter } from '@/app/types'
import { NextResponse } from 'next/server'
import { getOverallAvgWaitingTimeByHour } from '@/app/client/collections/energylandiaWaitingTime'
import { getQueryParams } from '../../../../../../helpers/query'
import { validate } from '@/app/utils/validate'
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
    const stats = await getOverallAvgWaitingTimeByHour(filters)
    return NextResponse.json(stats)
}
