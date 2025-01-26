import { AttractionWaitingTime } from '../model/attractionWaitingTime.model'
import mongoose from 'mongoose'

const WAITING_TIME_COLLECTION_NAME = 'EnergylandiaWaitingTime'
export const waitingTimeCollection = (db: mongoose.mongo.Db) => {
    return db.collection<AttractionWaitingTime>(WAITING_TIME_COLLECTION_NAME)
}

export const insertWaitingTimes = async (
    db: mongoose.mongo.Db,
    waitingTimes: AttractionWaitingTime[],
) => {
    const collection = waitingTimeCollection(db)
    return collection.insertMany(waitingTimes)
}
