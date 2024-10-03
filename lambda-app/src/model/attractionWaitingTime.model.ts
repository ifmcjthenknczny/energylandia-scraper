import { Day, Hour } from "../helpers/util/date";
import mongoose, { Schema } from 'mongoose';

export interface AttractionWaitingTime {
    date: Day;
    time: Hour;
    waitingTimeMinutes: number;
    attractionName: string;
    isInactive?: boolean;
    dayOfWeek: number;
    // openingHour: Hour;
    // closingHour: Hour;
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
    // Uncomment the following if needed:
    // openingHour: {
    //   type: String,
    //   required: true,
    // },
    // closingHour: {
    //   type: String,
    //   required: true,
    // },
});

export const AttractionWaitingTimeModel = mongoose.model<AttractionWaitingTime>('AttractionWaitingTime', AttractionWaitingTimeSchema);