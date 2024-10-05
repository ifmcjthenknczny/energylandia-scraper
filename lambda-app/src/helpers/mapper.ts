import { Hour, toDay } from "./util/date";

import { AttractionWaitingTime } from "../model/attractionWaitingTime.model";
import { OpeningHours } from "../model/openingHours.model";
import { ScrapedOpeningHours } from "../scrapers/openingHoursScraper";
import { WaitingTimeDataEntry } from "../scrapers/waitingTimesScraper";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs'

dayjs.extend(customParseFormat)

export function dataEntryToWaitingTime (dataEntry: WaitingTimeDataEntry, now: Date): AttractionWaitingTime {
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

export function responseToOpeningHours (response: ScrapedOpeningHours, now: Date): OpeningHours {
    const day = toDay(now)
    const dayOpeningHours = response[day]
    const isOpen = dayOpeningHours.status === 'otwarte'
    return {
        date: day,
        isOpen,
        ...(isOpen && {
            seasonName: dayOpeningHours.title,
            openingHour: dayOpeningHours.time_od,
            closingHour: dayOpeningHours.time_do }),
        scrapedAt: now,
    }
}

export function mapNaNsToZeros(waitingTime: AttractionWaitingTime): AttractionWaitingTime {
    return {
        ...waitingTime,
        waitingTimeMinutes: waitingTime.waitingTimeMinutes || 0
    }
}