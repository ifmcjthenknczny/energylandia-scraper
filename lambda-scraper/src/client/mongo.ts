import { log } from '../helpers/util/log'
import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

let cachedDb: mongoose.mongo.Db | undefined = undefined

export const mongo = async () => {
    if (cachedDb) {
        return cachedDb
    }
    await mongoose.connect(process.env.MONGO_URI!, {
        dbName: process.env.DATABASE_NAME,
        serverSelectionTimeoutMS: 5000,
    })
    cachedDb = mongoose.connection.db!
    log('CONNECTED TO MONGO')

    return cachedDb
}
