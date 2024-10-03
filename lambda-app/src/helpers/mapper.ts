import { Hour, toDay } from "./util/date";

import { AttractionWaitingTime } from "../model/attractionWaitingTime.model";
import { DataEntry } from "./scraper";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs'

dayjs.extend(customParseFormat)

export function dataEntryToWaitingTime (dataEntry: DataEntry, now: Date): AttractionWaitingTime {
    const [name, waitingTime, status, lastUpdateString] = dataEntry;
    const [lastUpdateHour, lastUpdateDate] = lastUpdateString.trim().split(' ')
    const dataUpdate = dayjs(lastUpdateDate.replace('(', '').replace(')', '').trim(), 'DD.MM.YYYY')

    const isInactive = !!status.trim()
    const dayOfWeek = dataUpdate.day()
    
    return {
        date: toDay(dataUpdate),
        time: lastUpdateHour as Hour,
        waitingTimeMinutes: parseInt(waitingTime),
        attractionName: name,
        isInactive,
        dayOfWeek,
        scrapedAt: now
    } 
}