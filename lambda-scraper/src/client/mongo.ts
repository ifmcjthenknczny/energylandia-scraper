import { log } from '../helpers/util/log'
import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const DATABASE_NAME = 'Energylandia'

export const mongo = async (uri: string) => {
    await mongoose.connect(uri, {
        dbName: DATABASE_NAME,
        serverSelectionTimeoutMS: 5000,
    })
    log('CONNECTED TO MONGO')

    return mongoose.connection.db!
}
