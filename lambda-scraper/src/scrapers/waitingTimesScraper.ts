import { WAITING_TIME_REQUEST_BODY, WAITING_TIME_URL } from '../config'
import { dataEntryToWaitingTime, mapNaNsToZeros } from '../helpers/mapper'
import { hourNow, toDay, toHour } from '../helpers/util/date'
import { log, logWarn } from '../helpers/util/log'

import { ScriptContext } from '../context'
import axios from 'axios'
import dayjs from 'dayjs'
import { getOpeningAndClosingHour } from '../client/openingHours'
import timezone from 'dayjs/plugin/timezone'
import { upsertWaitingTimes } from '../client/attractionWaitingTime'
import utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)

export type WaitingTimeDataEntry = [
    string, // name
    string, // waiting time
    string, // status
    string, // HH:MM DD.MM.RRRR last update
]

type ScrapedWaitingTimes = {
    draw: number
    recordsTotal: number
    recordsFiltered: number
    data: WaitingTimeDataEntry[]
}

export async function scrapeEnergylandiaWaitingTimes(context: ScriptContext) {
    const scrapedWaitingTimes = (
        await axios.post<ScrapedWaitingTimes>(
            WAITING_TIME_URL,
            WAITING_TIME_REQUEST_BODY,
        )
    ).data
    log('SCRAPED WAITING TIME DATA!')

    const mappedScrapedWaitingTimes = scrapedWaitingTimes.data.map(
        (dataEntry) => dataEntryToWaitingTime(dataEntry, context.now),
    )
    log('MAPPED WAITING TIME DATA!')

    if (!mappedScrapedWaitingTimes?.length) {
        logWarn(
            'NO SCRAPED WAITING TIME DATA TO INSERT. HAVE NOT INSERTED ANY DATA',
        )
    }

    const allAttractionsInactiveOrHasZeroWaitingTime =
        mappedScrapedWaitingTimes.every(
            (waitingTime) =>
                waitingTime.isInactive || !waitingTime.waitingTimeMinutes,
        )

    if (allAttractionsInactiveOrHasZeroWaitingTime) {
        const openingHours = await getOpeningAndClosingHour(
            context.db,
            toDay(context.now),
        )
        if (!openingHours) {
            logWarn('NO OPENING HOURS FOUND. HAVE NOT INSERTED ANY DATA')
            return
        }
        const closingHour = openingHours.closingHour
        const openingHour = openingHours.openingHour
        const hourRightNow = toHour(hourNow(context.now))

        if (
            !openingHours.isOpen ||
            (openingHour && hourRightNow < openingHour) ||
            (closingHour && hourRightNow > closingHour)
        ) {
            logWarn('ENERGYLANDIA IS CLOSED. HAVE NOT INSERTED ANY DATA')
            return
        }

        logWarn('ALL ATTRACTIONS ARE INACTIVE. HAVE NOT INSERTED ANY DATA')
        return
    }

    const mappedWaitingTimes = mappedScrapedWaitingTimes.map(mapNaNsToZeros)

    await upsertWaitingTimes(context.db, mappedWaitingTimes)
    log('INSERTED ATTRACTION WAITING TIME DATA INTO DB')
}
