import { Day } from 'aws-sdk/clients/inspector2'
import { ScriptContext } from '../context'
import { log } from '../helpers/util/log'
import { openingHoursCollection } from './../client/openingHours'
import { waitingTimeCollection } from '../client/attractionWaitingTime'

type CountedData = {
    uniqueDates: Day[]
    totalCount: number
}

const getWaitingTimesUniqueDatesAndCount = async (context: ScriptContext) => {
    const waitingTimes = await waitingTimeCollection(context.db)
    const result = (await waitingTimes
        .aggregate([
            {
                $group: {
                    _id: '$date',
                },
            },
            {
                $group: {
                    _id: null,
                    uniqueDates: { $addToSet: '$_id' },
                    totalCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    uniqueDates: 1,
                    totalCount: 1,
                },
            },
        ])
        .toArray()) as CountedData[]

    if (result.length > 0) {
        return {
            uniqueDates: result[0].uniqueDates,
            totalCount: result[0].totalCount,
        }
    }

    return {
        uniqueDates: [],
        totalCount: 0,
    }
}

const getOpeningHoursUniqueDatesAndCount = async (
    context: ScriptContext,
): Promise<CountedData> => {
    const openingHours = await openingHoursCollection(context.db)
    const result = (await openingHours
        .aggregate([
            {
                $match: {
                    isOpen: true,
                },
            },
            {
                $group: {
                    _id: '$date',
                },
            },
            {
                $group: {
                    _id: null,
                    uniqueDates: { $addToSet: '$_id' },
                    totalCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    uniqueDates: 1,
                    totalCount: 1,
                },
            },
        ])
        .toArray()) as CountedData[]

    if (result.length > 0) {
        return {
            uniqueDates: result[0].uniqueDates,
            totalCount: result[0].totalCount,
        }
    }

    return {
        uniqueDates: [],
        totalCount: 0,
    }
}

const getUniqueDatesDifference = async (context: ScriptContext) => {
    const waitingTimesData = await getWaitingTimesUniqueDatesAndCount(context)
    const openingHoursData = await getOpeningHoursUniqueDatesAndCount(context)

    const waitingTimesDates = new Set(waitingTimesData.uniqueDates)
    const openingHoursDates = new Set(openingHoursData.uniqueDates)

    log(`WaitingTimeDates: ${waitingTimesDates.size}`)
    log(`OpeningHoursDates: ${openingHoursDates.size}`)

    const difference = [...openingHoursDates].filter(
        (date) => !waitingTimesDates.has(date),
    )

    const result = {
        difference,
        differenceCount: difference.length,
    }

    log(result)

    return result
}

export default getUniqueDatesDifference
