import { Day, Hour } from '../helpers/util/date';

import { OPENING_HOURS_URL } from '../config';
import { ScriptContext } from '../context';
import axios from 'axios';
import { insertOpeningHours } from '../client/mongo';
import { log } from '../helpers/util/log';
import { responseToOpeningHours } from '../helpers/mapper';

type Color = `#${string}`

type ScrapedOpeningHour = {
    date: string
    data: Day
    title: string
    color: Color
    birthdays: {
        "": string
    }
} & ( {
    status: 'zamkniete'
    time_od: '00'
    time_do: '00'
} | {status: 'otwarte', time_od: Hour, time_do: Hour})

export type ScrapedOpeningHours = Record<Day, ScrapedOpeningHour>

export async function scrapeEnergylandiaOpeningHours(context: ScriptContext) {
    const scrapedOpeningHours = (await axios.post<ScrapedOpeningHours>(OPENING_HOURS_URL)).data
    log('SCRAPED OPENING HOUR DATA!')
    
    const mappedOpeningHour = responseToOpeningHours(scrapedOpeningHours, context.now)
    log('MAPPED OPENING HOUR DATA!')
    
    await insertOpeningHours(context.db, mappedOpeningHour)
    log('INSERTED OPENING HOUR DATA INTO DB')
}