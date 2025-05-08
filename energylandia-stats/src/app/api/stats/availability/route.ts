import { Filter } from '@/types'
import { NextResponse } from 'next/server'
import { filterSchema } from '@/schema'
import { findAvailabilityByAttraction } from '@/client/collections/attractionWaitingTime'
import { getQueryParams } from '../../../../utils/query'
import handleRequest from '@/utils/request'
import { validate } from '@/utils/validate'

const handler = async (req: Request) => {
    const query = getQueryParams(req)
    const filters = validate<Filter | undefined>(query, filterSchema)
    const stats = await findAvailabilityByAttraction(filters)
    return NextResponse.json(stats)
}

export const GET = handleRequest(handler)
