import { WAITING_TIME_REQUEST_BODY, WAITING_TIME_URL } from '../config';
import { dataEntryToWaitingTime, mapNaNsToZeros } from '../helpers/mapper';
import { log, logWarn } from '../helpers/util/log';
import { toDay, toHour } from '../helpers/util/date';

import { ScriptContext } from '../context';
import axios from 'axios';
import dayjs from 'dayjs';
import { getOpeningAndClosingHour } from '../client/openingHours';
import { insertWaitingTimes } from '../client/attractionWaitingTime';
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)

export type WaitingTimeDataEntry = [
    string, // name
    string, // waiting time
    string, // status
    string // HH:MM DD.MM.RRRR last update
]

type ScrapedWaitingTimes = {
    draw: number
    recordsTotal: number
    recordsFiltered: number
    data: WaitingTimeDataEntry[]
}

export async function scrapeEnergylandiaWaitingTimes(context: ScriptContext) {
    const scrapedWaitingTimes = (await axios.post<ScrapedWaitingTimes>(WAITING_TIME_URL, WAITING_TIME_REQUEST_BODY)).data
    log('SCRAPED WAITING TIME DATA!')
    
    const mappedScrapedWaitingTimes = scrapedWaitingTimes.data.map((dataEntry) => dataEntryToWaitingTime(dataEntry, context.now))
    log('MAPPED WAITING TIME DATA!')

    if (!mappedScrapedWaitingTimes) {
        logWarn('NO SCRAPED WAITING TIME DATA TO INSERT')
    }

    const allAttractionsInactive = mappedScrapedWaitingTimes.every((waitingTime) => waitingTime.isInactive && isNaN(waitingTime.waitingTimeMinutes))

    if (allAttractionsInactive) {
        const openingHours = await getOpeningAndClosingHour(context.db, toDay(context.now))
        if (!openingHours) {
            logWarn('NO OPENING HOURS FOUND')
            return
        }
        const closingHour = openingHours.closingHour
        const openingHour = openingHours.openingHour
        const hourRightNow = toHour(dayjs(context.now).tz('Europe/Warsaw'))
        
        if (!openingHours.isOpen || (openingHour && hourRightNow < openingHour) || (closingHour && hourRightNow > closingHour)) {
            logWarn('PARK IS CLOSED')
            return
        }

        logWarn('ALL ATTRACTIONS ARE INACTIVE. HAVE NOT INSERTED ANY DATA')
        return
    }

    const mappedWaitingTimes = mappedScrapedWaitingTimes.map(mapNaNsToZeros)

    await insertWaitingTimes(context.db, mappedWaitingTimes)
    log('INSERTED ATTRACTION WAITING TIME DATA INTO DB')
}