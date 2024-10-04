import { Day, Hour } from "../helpers/util/date";
import mongoose, { Schema } from 'mongoose';

export interface OpeningHours {
    date: Day;
    seasonName?: string;
    openingHour?: Hour;
    closingHour?: Hour;
    isOpen: boolean;
    scrapedAt: Date;
  }
  

export const OpeningHoursSchema: Schema<OpeningHours> = new Schema({
    date: {
        type: String,
        required: true,
    },
    seasonName: {
        type: String,
        required: false,
    },
    openingHour: {
      type: String,
      required: false,
    },
    isOpen: {
        type: Boolean,
        required: true
    },
    closingHour: {
      type: String,
      required: false,
    },
    scrapedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export const OpeningHoursModel = mongoose.model<OpeningHours>('OpeningHours', OpeningHoursSchema);