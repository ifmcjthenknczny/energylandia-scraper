'use client'

import React, { useEffect, useState } from 'react'

import DayFilters from './DayFilters'
import DayOfWeekFilter from './DayOfWeekFilter'
import { useSearchParams } from 'next/navigation'

// import TimeFilters from './TimeFilters';

export const FIRST_DAY_OF_DATA = '2024-10-05'

const Filters = () => {
    const searchParams = useSearchParams()
    const [dayFrom, setDayFrom] = useState<Date | null>(null)
    const [dayTo, setDayTo] = useState<Date | null>(null)
    const [dayOfWeek, setDayOfWeek] = useState<number | null>(null)
    // const [hourFrom, setHourFrom] = useState<string | null>(null);
    // const [hourTo, setHourTo] = useState<string | null>(null);

    useEffect(() => {
        const dayFromParam = searchParams?.get('dayFrom')
        const dayToParam = searchParams?.get('dayTo')
        const dayOfWeekParam = searchParams?.get('dayOfWeek')
        // const hourFromParam = searchParams.get('hourFrom');
        // const hourToParam = searchParams.get('hourTo');

        setDayFrom(dayFromParam ? new Date(dayFromParam) : null)
        setDayTo(dayToParam ? new Date(dayToParam) : null)
        setDayOfWeek(dayOfWeekParam ? parseInt(dayOfWeekParam, 10) : null)
        // setHourFrom(hourFromParam);
        // setHourTo(hourToParam);
    }, [searchParams])

    return (
        <div className="mb-8 mt-4 w-full">
            <div className="w-full flex flex-row justify-evenly">
                <DayOfWeekFilter
                    dayOfWeek={dayOfWeek}
                    onDayOfWeekChange={setDayOfWeek}
                />
                <DayFilters
                    dayFrom={dayFrom}
                    dayTo={dayTo}
                    onDayFromChange={setDayFrom}
                    onDayToChange={setDayTo}
                />
                {/* <TimeFilters
          hourFrom={hourFrom}
          hourTo={hourTo}
          onHourFromChange={setHourFrom}
          onHourToChange={setHourTo}
        /> */}
            </div>
        </div>
    )
}

export default Filters
