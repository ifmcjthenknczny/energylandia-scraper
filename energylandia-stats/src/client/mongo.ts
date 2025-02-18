import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export const DESC = -1
export const ASC = 1

mongoose.set('strictQuery', true)

let cachedDb: mongoose.mongo.Db | undefined = undefined

export const mongo = async () => {
    if (cachedDb) {
        return cachedDb
    }
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            dbName: process.env.DATABASE_NAME,
            serverSelectionTimeoutMS: 5000,
        })
        cachedDb = mongoose.connection.db
        return cachedDb
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(`Problem connecting with mongo: ${err}`)
    }
}
