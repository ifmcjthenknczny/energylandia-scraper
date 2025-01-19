import { dayOfWeekSchema, daySchema, hourSchema } from '@/app/utils/schema'

import { Filter } from '@/app/types'
import { NextResponse } from 'next/server'
import { getAvgWaitingTimeByAttraction } from '@/app/client/mongo'
import { getQueryParams } from '../../../../helpers/query'
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
    try {
        const query = getQueryParams(req)
        const filters = validate<Filter | undefined>(query, schema)
        const stats = await getAvgWaitingTimeByAttraction(filters)
        return NextResponse.json(stats)
    } catch (e: unknown) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}
