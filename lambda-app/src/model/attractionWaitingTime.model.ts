import { Day, Hour } from "../helpers/util/date";

export interface AttractionWaitingTime {
    date: Day;
    time: Hour;
    waitingTimeMinutes: number;
    attractionName: string;
    isInactive: boolean;
    dayOfWeek: number;
    // openingHour: Hour;
    // closingHour: Hour;
    scrapedAt: Date;
  }
  