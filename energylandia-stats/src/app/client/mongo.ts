import { AvgTimeByHourResponse, AvgTimeResponse } from '../types';
import { Day, Hour } from '../utils/date';

import { Filter } from '../types';
import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config()

const DESC = -1
const ASC = 1

export interface AttractionWaitingTime {
    date: Day;
    time: Hour;
    waitingTimeMinutes: number;
    attractionName: string;
    isInactive?: boolean;
    dayOfWeek: number;
    scrapedAt: Date;
  }
  

mongoose.set('strictQuery', true);

const DATABASE_NAME = 'Energylandia';

export const mongoConnect = async () => {
    await mongoose.connect(process.env.MONGO_URI!, {
        dbName: DATABASE_NAME,
        serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to mongo!')

    return mongoose.connection.db!;
}

export const mongoDb = await mongoConnect()

const WAITING_TIME_COLLECTION_NAME = 'EnergylandiaWaitingTime'
export const waitingTimeCollection = mongoDb.collection<AttractionWaitingTime>(WAITING_TIME_COLLECTION_NAME);

function buildFilter(filter?: Filter) {
    const dayFilter = filter?.dayFrom || filter?.dayTo
    ? {
        date: {
          ...(filter?.dayFrom && { $gte: filter.dayFrom }),
          ...(filter?.dayTo && { $lte: filter.dayTo })
        }
      }
    : {};
  
  const hourFilter = filter?.hourFrom || filter?.hourTo
    ? {
        time: {
          ...(filter?.hourFrom && { $gte: filter.hourFrom }),
          ...(filter?.hourTo && { $lte: filter.hourTo })
        }
      }
    : {};
  
  const dayOfWeekFilter = filter?.dayOfWeek !== undefined
    ? { dayOfWeek: filter.dayOfWeek }
    : {};

    return {
        ...dayFilter,
        ...hourFilter,
        ...dayOfWeekFilter,
    }
}

export const getAvgWaitingTimeByAttraction = async (filter?: Filter): Promise<AvgTimeResponse> => {
    const matchFilter = buildFilter(filter)

        const result = await waitingTimeCollection.aggregate([
        {
            $match: {
                ...matchFilter,
                isInactive: false,
                waitingTimeMinutes: { $gte: 0 }
            }
          },
        {
          $group: {
            _id: "$attractionName",
            avgWaitingTime: { $avg: "$waitingTimeMinutes" }
          }
        },
        {
          $project: {
            _id: 0,
            attractionName: "$_id",
            avgWaitingTime: 1
          }
        },
        {
            $sort: { avgWaitingTime: DESC }
        }
      ]).toArray()
    const avgWaitingTime = Object.fromEntries(result.map(({ attractionName, avgWaitingTime }) => [attractionName, avgWaitingTime]))
    return avgWaitingTime as AvgTimeResponse
}

export const getAvgWaitingTimeByAttractionAndHour = async (filter?: Omit<Filter, 'hourFrom' | 'hourTo'>): Promise<AvgTimeByHourResponse> => {    
    const matchFilter = buildFilter(filter)

    const results = await waitingTimeCollection.aggregate([
        {
            $match: {
                ...matchFilter,
                isInactive: false,
                waitingTimeMinutes: { $gte: 0 }
            }
        },
        {
            $project: {
                attractionName: 1,
                waitingTimeMinutes: 1,
                hour: { $arrayElemAt: [{ $split: ["$time", ":"] }, 0] },
                minute: { $arrayElemAt: [{ $split: ["$time", ":"] }, 1] }
            }
        },
        {
            $project: {
                attractionName: 1,
                waitingTimeMinutes: 1,
                timeSlot: {
                    $concat: [
                        "$hour",
                        ":",
                        {
                            $cond: [
                                { $lt: [{ $toInt: "$minute" }, 15] }, "00",
                                {
                                    $cond: [
                                        { $lt: [{ $toInt: "$minute" }, 30] }, "15",
                                        {
                                            $cond: [
                                                { $lt: [{ $toInt: "$minute" }, 45] }, "30",
                                                "45"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            $group: {
                _id: {
                    attractionName: "$attractionName",
                    timeSlot: "$timeSlot"
                },
                avgWaitingTime: { $avg: "$waitingTimeMinutes" },
            }
        },
        {
            $group: {
                _id: "$_id.attractionName",
                avgTimesByHour: {
                    $push: {
                        k: "$_id.timeSlot",
                        v: "$avgWaitingTime"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                attractionName: "$_id",
                avgTimesByHour: { $arrayToObject: "$avgTimesByHour" }
            }
        },
        {
            $sort: { attractionName: ASC }
        }
    ]).toArray();

    const finalResult: Record<string, Record<string, number>> = {};
    for (const result of results) {
        const sortedHours = Object.entries(result.avgTimesByHour).toSorted(([hourA], [hourB]) => hourA.localeCompare(hourB)) as [Hour, number][];
        finalResult[result.attractionName] = Object.fromEntries(sortedHours);
    }

    return finalResult as AvgTimeByHourResponse;
};

export async function getOverallAvgWaitingTimeByHour(filter?: Filter) {
    const matchFilter = buildFilter(filter)
    const results = await waitingTimeCollection.aggregate([
        {
            $match: {
                ...matchFilter,
                isInactive: false,
                waitingTimeMinutes: { $gte: 0 }
            }
        },
        {
            $project: {
                waitingTimeMinutes: 1,
                hour: { $arrayElemAt: [{ $split: ["$time", ":"] }, 0] },
                minute: { $arrayElemAt: [{ $split: ["$time", ":"] }, 1] }
            }
        },
        {
            $project: {
                waitingTimeMinutes: 1,
                timeSlot: {
                    $concat: [
                        "$hour",
                        ":",
                        {
                            $cond: [
                                { $lt: [{ $toInt: "$minute" }, 15] }, "00",
                                {
                                    $cond: [
                                        { $lt: [{ $toInt: "$minute" }, 30] }, "15",
                                        {
                                            $cond: [
                                                { $lt: [{ $toInt: "$minute" }, 45] }, "30",
                                                "45"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$timeSlot",
                avgWaitingTime: { $avg: "$waitingTimeMinutes" }
                // avgWaitingTime: { $sum: "$waitingTimeMinutes" }
            }
        },
        {
            $project: {
                _id: 0,
                timeSlot: "$_id",
                avgWaitingTime: 1
            }
        },
        {
            $sort: { timeSlot: 1 }
        }
    ]).toArray();

    const avgOverallWaitingTime = results.reduce((acc, { timeSlot, avgWaitingTime }) => {
        acc[timeSlot] = avgWaitingTime;
        return acc;
    }, {} as Record<string, number>)

    return avgOverallWaitingTime
}

export async function getAvailabilityByAttraction(filter?: Filter) {
    const matchFilter = buildFilter(filter)
    const results = await waitingTimeCollection.aggregate([
        {
            $match: matchFilter
        },
        {
            $group: {
                _id: "$attractionName",
                inactiveCount: { $sum: { $cond: [{ $eq: ["$isInactive", true] }, 1, 0] } },
                totalCount: { $sum: 1 }
            }
        },
        {
            $project: {
                attractionName: "$_id",
                reliability: {
                    $divide: [
                        { $subtract: ["$totalCount", "$inactiveCount"] },
                        "$totalCount"
                    ]
                }
            }
        },
        {
            $sort: { reliability: 1 }
        },
        {
            $project: {
                _id: 0,
                attractionName: 1,
                reliability: 1
            }
        }
    ]).toArray();

    const availabilityRecord = results.reduce<Record<string, number>>((acc, record) => {
        acc[record.attractionName] = record.reliability;
        return acc;
    }, {});
    

    return availabilityRecord;
}