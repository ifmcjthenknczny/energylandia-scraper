import { toDay, toHour } from "./util/date";

import { AttractionWaitingTime } from "../model/attractionWaitingTime.model";
import { DataEntry } from "./scraper";
import dayjs from 'dayjs'

export function dataEntryToWaitingTime (dataEntry: DataEntry, now: Date): AttractionWaitingTime {
    const [name, waitingTime, status, lastUpdateString] = dataEntry;
    const dataUpdate = dayjs(lastUpdateString)
    const isInactive = !!status.trim()
    const dayOfWeek = dataUpdate.day()
    
    return {
        date: toDay(dataUpdate),
        time: toHour(dataUpdate),
        waitingTimeMinutes: parseInt(waitingTime),
        attractionName: name,
        isInactive,
        dayOfWeek,
        scrapedAt: now
    } 
}