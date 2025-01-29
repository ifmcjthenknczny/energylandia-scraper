import { Day, Hour } from './utils/date'

export type Filter = {
    dayFrom?: Day
    dayTo?: Day
    hourFrom?: Hour
    hourTo?: Hour
    dayOfWeek?: number
}

export type AvgTimeResponse = Record<string, number>
export type AvgTimeByHourResponse = Record<string, Record<Hour, number>>
