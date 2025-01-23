import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export const DESC = -1
export const ASC = 1

mongoose.set('strictQuery', true)

const DATABASE_NAME = 'Energylandia'

export const mongo = async () => {
    await mongoose.connect(process.env.MONGO_URI!, {
        dbName: DATABASE_NAME,
        serverSelectionTimeoutMS: 5000,
    })
    // eslint-disable-next-line no-console
    console.log('Connected to mongo!')

    return mongoose.connection.db!
}
