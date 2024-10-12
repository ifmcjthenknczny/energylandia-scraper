import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

const DATABASE_NAME = 'Energylandia';

export const mongo = async (uri: string) => {
    await mongoose.connect(uri, {
        dbName: DATABASE_NAME,
        serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to mongo!')

    return mongoose.connection.db!;
}