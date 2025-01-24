import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export const DESC = -1
export const ASC = 1

mongoose.set('strictQuery', true)

const DATABASE_NAME = 'Energylandia'

export const mongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            dbName: DATABASE_NAME,
            serverSelectionTimeoutMS: 5000,
        })
        return mongoose.connection.db!
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(`Problem with connecting with mongo: ${err}`)
    }
}
