import { AttractionWaitingTime } from '../model/attractionWaitingTime.model'
import mongoose from 'mongoose'

const WAITING_TIME_COLLECTION_NAME = 'EnergylandiaWaitingTime'
export const waitingTimeCollection = (db: mongoose.mongo.Db) => {
    return db.collection<AttractionWaitingTime>(WAITING_TIME_COLLECTION_NAME)
}

export const upsertWaitingTimes = async (
    db: mongoose.mongo.Db,
    waitingTimes: AttractionWaitingTime[],
) => {
    const collection = waitingTimeCollection(db)
    const bulkOps = waitingTimes.map((waitingTime) => ({
        updateOne: {
            filter: {
                date: waitingTime.date,
                time: waitingTime.time,
                attractionName: waitingTime.attractionName,
            },
            update: {
                $set: waitingTime,
            },
            upsert: true,
        },
    }))
    return collection.bulkWrite(bulkOps)
}
