import { COLLECTION_NAME, DATABASE_NAME } from '../../config';

import { AttractionWaitingTime } from '../../model/attractionWaitingTime.model';
import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

export const waitingTimeCollection = async (uri: string) => {
    console.log(uri);
    
    await mongoose.connect(uri, {
        dbName: DATABASE_NAME,
        serverSelectionTimeoutMS: 5000,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });
    console.log('Connected!')

    return mongoose.connection.db!.collection<AttractionWaitingTime>(COLLECTION_NAME);
}
