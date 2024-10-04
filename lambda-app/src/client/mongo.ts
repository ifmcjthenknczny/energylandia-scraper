import { AttractionWaitingTime } from '../model/attractionWaitingTime.model';
import { Day } from '../helpers/util/date';
import { OpeningHours } from '../model/openingHours.model';
import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

const DATABASE_NAME = 'Energylandia';
const WAITING_TIME_COLLECTION_NAME = 'EnergylandiaWaitingTime'
const OPENING_HOURS_COLLECTION_NAME = 'EnergylandiaOpeningHours'

export const mongo = async (uri: string) => {
    await mongoose.connect(uri, {
        dbName: DATABASE_NAME,
        serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected!')

    return mongoose.connection.db!;
}

const waitingTimeCollection = async (db: mongoose.mongo.Db) => {
    return db.collection<AttractionWaitingTime>(WAITING_TIME_COLLECTION_NAME);
}

const openingHourCollection = async (db: mongoose.mongo.Db) => {
    return db.collection<OpeningHours>(OPENING_HOURS_COLLECTION_NAME);
}

export const insertWaitingTimes = async (db: mongoose.mongo.Db, waitingTimes: AttractionWaitingTime[]) => {
    const collection = await waitingTimeCollection(db);
    return collection.insertMany(waitingTimes);
}

export const getOpeningAndClosingHour = async (db: mongoose.mongo.Db, date: Day) => {
    const collection = await openingHourCollection(db);
    return collection.findOne({ date });
}

export const insertOpeningHours = async (db: mongoose.mongo.Db, openingTime: OpeningHours) => {
    const collection = await openingHourCollection(db);
    return collection.insertOne(openingTime);
}