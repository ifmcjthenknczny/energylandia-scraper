import { ASC, DESC, mongo } from '../mongo'
import { AvgTimeByHourResponse, AvgTimeResponse, Filter } from '@/app/types'
import { Day, Hour } from '@/app/utils/date'

import { buildFilter } from '../filter'

export type AttractionWaitingTime = {
    date: Day
    time: Hour
    waitingTimeMinutes: number
    attractionName: string
    isInactive?: boolean
    dayOfWeek: number
    scrapedAt: Date
}

type AvgOverallWaitingTime = Record<string, number>
type AttractionAvailability = Record<string, number>

const WAITING_TIME_COLLECTION_NAME = 'EnergylandiaWaitingTime'
export const waitingTimeCollection = async () => {
    const db = await mongo()
    return db!.collection<AttractionWaitingTime>(WAITING_TIME_COLLECTION_NAME)
}

export const getAvgWaitingTimeByAttraction = async (
    filter?: Filter,
): Promise<AvgTimeResponse> => {
    const collection = await waitingTimeCollection()
    const matchFilter = buildFilter(filter)

    const result = (await collection
        .aggregate([
            {
                $match: {
                    ...matchFilter,
                    isInactive: false,
                    waitingTimeMinutes: { $gte: 0 },
                },
            },
            {
                $group: {
                    _id: '$attractionName',
                    avgWaitingTime: { $avg: '$waitingTimeMinutes' },
                },
            },
            {
                $project: {
                    _id: 0,
                    attractionName: '$_id',
                    avgWaitingTime: 1,
                },
            },
            {
                $sort: { avgWaitingTime: DESC },
            },
        ])
        .toArray()) as { attractionName: string; avgWaitingTime: number }[]
    const avgWaitingTime = Object.fromEntries(
        result.map(({ attractionName, avgWaitingTime }) => [
            attractionName,
            avgWaitingTime,
        ]),
    )
    return avgWaitingTime
}

export const getAvgWaitingTimeByAttractionAndHour = async (
    filter?: Omit<Filter, 'hourFrom' | 'hourTo'>,
): Promise<AvgTimeByHourResponse> => {
    const matchFilter = buildFilter(filter)
    const collection = await waitingTimeCollection()

    const results = (await collection
        .aggregate(
            [
                {
                    $match: {
                        ...matchFilter,
                        isInactive: false,
                        waitingTimeMinutes: { $gte: 0 },
                    },
                },
                {
                    $project: {
                        attractionName: 1,
                        waitingTimeMinutes: 1,
                        hour: { $arrayElemAt: [{ $split: ['$time', ':'] }, 0] },
                        minute: {
                            $arrayElemAt: [{ $split: ['$time', ':'] }, 1],
                        },
                    },
                },
                {
                    $project: {
                        attractionName: 1,
                        waitingTimeMinutes: 1,
                        timeSlot: {
                            $concat: [
                                '$hour',
                                ':',
                                {
                                    $cond: [
                                        { $lt: [{ $toInt: '$minute' }, 15] },
                                        '00',
                                        {
                                            $cond: [
                                                {
                                                    $lt: [
                                                        { $toInt: '$minute' },
                                                        30,
                                                    ],
                                                },
                                                '15',
                                                {
                                                    $cond: [
                                                        {
                                                            $lt: [
                                                                {
                                                                    $toInt: '$minute',
                                                                },
                                                                45,
                                                            ],
                                                        },
                                                        '30',
                                                        '45',
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            attractionName: '$attractionName',
                            timeSlot: '$timeSlot',
                        },
                        avgWaitingTime: { $avg: '$waitingTimeMinutes' },
                    },
                },
                {
                    $group: {
                        _id: '$_id.attractionName',
                        avgTimesByHour: {
                            $push: {
                                k: '$_id.timeSlot',
                                v: '$avgWaitingTime',
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        attractionName: '$_id',
                        avgTimesByHour: { $arrayToObject: '$avgTimesByHour' },
                    },
                },
                {
                    $sort: { attractionName: ASC },
                },
            ],
            {
                collation: { locale: 'pl', strength: 1 },
            },
        )
        .toArray()) as { attractionName: string; avgTimesByHour: number }[]

    const finalResult: Record<string, Record<string, number>> = {}
    for (const result of results) {
        const sortedHours = Object.entries(result.avgTimesByHour).toSorted(
            ([hourA], [hourB]) => hourA.localeCompare(hourB),
        ) as [Hour, number][]
        finalResult[result.attractionName] = Object.fromEntries(sortedHours)
    }

    return finalResult
}

export async function getOverallAvgWaitingTimeByHour(
    filter?: Filter,
): Promise<AvgOverallWaitingTime> {
    const matchFilter = buildFilter(filter)
    const collection = await waitingTimeCollection()

    const results = (await collection
        .aggregate([
            {
                $match: {
                    ...matchFilter,
                    isInactive: false,
                    waitingTimeMinutes: { $gte: 0 },
                },
            },
            {
                $project: {
                    waitingTimeMinutes: 1,
                    hour: { $arrayElemAt: [{ $split: ['$time', ':'] }, 0] },
                    minute: { $arrayElemAt: [{ $split: ['$time', ':'] }, 1] },
                },
            },
            {
                $project: {
                    waitingTimeMinutes: 1,
                    timeSlot: {
                        $concat: [
                            '$hour',
                            ':',
                            {
                                $cond: [
                                    { $lt: [{ $toInt: '$minute' }, 15] },
                                    '00',
                                    {
                                        $cond: [
                                            {
                                                $lt: [
                                                    { $toInt: '$minute' },
                                                    30,
                                                ],
                                            },
                                            '15',
                                            {
                                                $cond: [
                                                    {
                                                        $lt: [
                                                            {
                                                                $toInt: '$minute',
                                                            },
                                                            45,
                                                        ],
                                                    },
                                                    '30',
                                                    '45',
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: '$timeSlot',
                    avgWaitingTime: { $avg: '$waitingTimeMinutes' },
                },
            },
            {
                $project: {
                    _id: 0,
                    timeSlot: '$_id',
                    avgWaitingTime: 1,
                },
            },
            {
                $sort: { timeSlot: 1 },
            },
        ])
        .toArray()) as { timeSlot: string; avgWaitingTime: number }[]

    const avgOverallWaitingTime = results.reduce(
        (acc, { timeSlot, avgWaitingTime }) => {
            acc[timeSlot] = avgWaitingTime
            return acc
        },
        {} as AvgOverallWaitingTime,
    )

    return avgOverallWaitingTime
}

export async function getAvailabilityByAttraction(
    filter?: Filter,
): Promise<AttractionAvailability> {
    const matchFilter = buildFilter(filter)
    const collection = await waitingTimeCollection()

    const results = (await collection
        .aggregate([
            {
                $match: matchFilter,
            },
            {
                $group: {
                    _id: '$attractionName',
                    inactiveCount: {
                        $sum: { $cond: [{ $eq: ['$isInactive', true] }, 1, 0] },
                    },
                    totalCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    attractionName: '$_id',
                    reliability: {
                        $divide: [
                            { $subtract: ['$totalCount', '$inactiveCount'] },
                            '$totalCount',
                        ],
                    },
                },
            },
            {
                $sort: { reliability: 1 },
            },
            {
                $project: {
                    _id: 0,
                    attractionName: 1,
                    reliability: 1,
                },
            },
        ])
        .toArray()) as { attractionName: string; reliability: number }[]

    const availabilityRecord = results.reduce((acc, record) => {
        acc[record.attractionName] = record.reliability
        return acc
    }, {} as AttractionAvailability)

    return availabilityRecord
}
