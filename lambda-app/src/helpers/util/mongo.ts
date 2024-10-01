import { COLLECTION_NAME, DATABASE_NAME } from '../../config';

import { AttractionWaitingTime } from '../../model/attractionWaitingTime.model';
import { MongoClient } from 'mongodb'

export const waitingTimeCollection = async (uri: string) => {
    const client = new MongoClient(uri);
    await client.connect();

    return client.db(DATABASE_NAME).collection<AttractionWaitingTime>(COLLECTION_NAME)
};
