import { Filter, getAvgWaitingTimeByAttraction } from "@/app/client/mongo";
import { dayOfWeekSchema, daySchema, hourSchema } from "@/app/utils/schema";

import { NextResponse } from "next/server";
import { getQueryParams } from "../../../../helpers/query";
import { validate } from "@/app/utils/validate";
import { z } from "zod";

const schema = z.object({
    dayFrom: daySchema.optional(),
    dayTo: daySchema.optional(),
    hourFrom: hourSchema.optional(),
    hourTo: hourSchema.optional(),
    dayOfWeek: dayOfWeekSchema.optional()
}).optional()

export async function GET(req: Request) {
    try {
        const query = getQueryParams(req)
        const filters = validate<Filter | undefined>(query, schema)
        const stats = await getAvgWaitingTimeByAttraction(filters)
        return NextResponse.json(stats)
    // eslint-disable-next-line
    } catch (e: any) {
        return NextResponse.json({error: e.message}, { status: 400 })
    }
}