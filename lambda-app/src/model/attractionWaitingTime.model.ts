import { Day, Hour } from "../helpers/util/date";
import mongoose, { Schema } from 'mongoose';

export interface AttractionWaitingTime {
    date: Day;
    time: Hour;
    waitingTimeMinutes: number;
    attractionName: string;
    isInactive?: boolean;
    dayOfWeek: number;
    scrapedAt: Date;
  }
  

export const AttractionWaitingTimeSchema: Schema<AttractionWaitingTime> = new Schema({
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    waitingTimeMinutes: {
        type: Number,
        required: true,
    },
    attractionName: {
        type: String,
        required: true,
    },
    isInactive: {
        type: Boolean,
    },
    dayOfWeek: {
        type: Number,
        required: true,
    },
    scrapedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export const AttractionWaitingTimeModel = mongoose.model<AttractionWaitingTime>('AttractionWaitingTime', AttractionWaitingTimeSchema);