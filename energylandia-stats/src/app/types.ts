import { Day, Hour } from './utils/date'

export interface Filter {
    dayFrom?: Day
    dayTo?: Day
    hourFrom?: Hour
    hourTo?: Hour
    dayOfWeek?: number
}

export type AvgTimeResponse = Record<string, number>
export type AvgTimeByHourResponse = Record<string, Record<Hour, number>>
