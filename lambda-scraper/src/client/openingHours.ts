import { Day } from '../helpers/util/date'
import { OpeningHours } from '../model/openingHours.model'
import mongoose from 'mongoose'

const OPENING_HOURS_COLLECTION_NAME = 'EnergylandiaOpeningHours'

export const openingHoursCollection = (db: mongoose.mongo.Db) => {
    return db.collection<OpeningHours>(OPENING_HOURS_COLLECTION_NAME)
}

export const findOpeningAndClosingHour = async (
    db: mongoose.mongo.Db,
    date: Day,
) => {
    const collection = openingHoursCollection(db)
    return collection.findOne({ date })
}

export const upsertOpeningHours = async (
    db: mongoose.mongo.Db,
    openingHours: OpeningHours,
) => {
    const collection = openingHoursCollection(db)
    return collection.updateOne(
        { date: openingHours.date },
        { $set: openingHours },
        { upsert: true },
    )
}
