import { log } from '../helpers/util/log'
import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

export const mongo = async () => {
    await mongoose.connect(process.env.MONGO_URI!, {
        dbName: process.env.DATABASE_NAME,
        serverSelectionTimeoutMS: 5000,
    })
    log('CONNECTED TO MONGO')

    return mongoose.connection.db!
}
