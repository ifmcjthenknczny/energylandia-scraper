import { WAITING_TIME_REQUEST_BODY, WAITING_TIME_URL } from '../config';
import { log, logWarn } from '../helpers/util/log';

import { ScriptContext } from '../context';
import axios from 'axios';
import { dataEntryToWaitingTime } from '../helpers/mapper';
import { insertWaitingTimes } from '../client/mongo';

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
    
    const mappedWaitingTimes = scrapedWaitingTimes.data.map((dataEntry) => dataEntryToWaitingTime(dataEntry, context.now))
    log('MAPPED WAITING TIME DATA!')

    if (!mappedWaitingTimes) {
        logWarn('NO SCRAPED WAITING TIME DATA TO INSERT')
    }

    const allAttractionsInactive = mappedWaitingTimes.every((waitingTime) => waitingTime.isInactive && isNaN(waitingTime.waitingTimeMinutes))

    if (allAttractionsInactive) {
        logWarn('ALL ATTRACTIONS ARE INACTIVE. HAVE NOT INSERTED ANY DATA')
        return
    }

    await insertWaitingTimes(context.db, mappedWaitingTimes)
    log('INSERTED WAITING TIME DATA INTO DB')
}