import { API_URL, REQUEST_BODY } from '../config';

import { ScriptContext } from './util/context';
import axios from 'axios';
import { dataEntryToWaitingTime } from './mapper';

export type DataEntry = [
    string, // name
    string, // waiting time
    string, // status
    string // HH:MM DD.MM.RRRR last update
]

type ScrapedWaitingTimes = {
    draw: number
    recordsTotal: number
    recordsFiltered: number
    data: DataEntry[]
}

export async function scrapeEnergylandiaWaitingTimes(context: ScriptContext) {
    const scrapedWaitingTimes = (await axios.post<ScrapedWaitingTimes>(API_URL, REQUEST_BODY)).data
    const mappedWaitingTimes = scrapedWaitingTimes.data.map((dataEntry) => dataEntryToWaitingTime(dataEntry, context.now))
    
    await context.collection.insertMany(mappedWaitingTimes)
}