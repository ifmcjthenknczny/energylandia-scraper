import { AttractionWaitingTime } from '../model/attractionWaitingTime.model'
import mongoose from 'mongoose'

const WAITING_TIME_COLLECTION_NAME = 'EnergylandiaWaitingTime'
export const waitingTimeCollection = async (db: mongoose.mongo.Db) => {
    return db.collection<AttractionWaitingTime>(WAITING_TIME_COLLECTION_NAME)
}

export const insertWaitingTimes = async (
    db: mongoose.mongo.Db,
    waitingTimes: AttractionWaitingTime[],
) => {
    const collection = await waitingTimeCollection(db)
    return collection.insertMany(waitingTimes)
}
