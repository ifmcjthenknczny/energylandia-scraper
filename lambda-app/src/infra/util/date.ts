import dayjs, {Dayjs} from 'dayjs';

export type Day = `${number}-${number}-${number}`;

type DateLike = Date | Day | Dayjs;

export function toTimestampSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

export function toDay(date: DateLike): Day {
    return dayjs(date).format('YYYY-MM-DD') as Day;
}

export function listDatesInRange(start: Day, end: Day) {
    // Left-side included, right-side excluded
    const allDates: Day[] = [];
    let currentDate = dayjs(start).startOf('day');
    while (currentDate.isBefore(end)) {
        allDates.push(toDay(currentDate));
        currentDate = currentDate.add(1, 'day');
    }
    return allDates;
}

export function yesterday(relativeDay: dayjs.Dayjs = dayjs()) {
    return toDay(relativeDay.subtract(1, 'day'));
}
