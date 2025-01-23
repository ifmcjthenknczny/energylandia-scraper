import dayjs, { Dayjs } from 'dayjs'

export type Day = `${number}-${number}-${number}`
export type Hour = `${number}:${number}`

type DateLike = Date | Day | Dayjs

export function toTimestampSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000)
}

export function toDay(date: DateLike): Day {
    return dayjs(date).format('YYYY-MM-DD') as Day
}

export function yesterday(relativeDay: dayjs.Dayjs = dayjs()) {
    return toDay(relativeDay.subtract(1, 'day'))
}

export function toHour(date: DateLike): Hour {
    return dayjs(date).format('HH:mm') as Hour
}

export function hourNow(date?: Date) {
    return dayjs(date).tz('Europe/Warsaw')
}
