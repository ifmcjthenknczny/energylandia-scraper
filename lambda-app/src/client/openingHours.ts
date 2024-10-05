import { Day } from "../helpers/util/date";
import { OpeningHours } from "../model/openingHours.model";
import mongoose from "mongoose";

const OPENING_HOURS_COLLECTION_NAME = 'EnergylandiaOpeningHours'

const openingHoursCollection = async (db: mongoose.mongo.Db) => {
    return db.collection<OpeningHours>(OPENING_HOURS_COLLECTION_NAME);
}

export const getOpeningAndClosingHour = async (db: mongoose.mongo.Db, date: Day) => {
    const collection = await openingHoursCollection(db);
    return collection.findOne({ date });
}

export const insertOpeningHours = async (db: mongoose.mongo.Db, openingHours: OpeningHours) => {
    const collection = await openingHoursCollection(db);
    return collection.insertOne(openingHours);
}