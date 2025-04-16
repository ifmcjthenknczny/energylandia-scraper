'use client'

import React, { useEffect, useState } from 'react'

import DayFilters from './DayFilters'
import DayOfWeekFilter from './DayOfWeekFilter'
import RemoveFilterButton from './RemoveFilterButton'
import VerticalLine from '../util/VerticalLine'
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
        <div className="mb-8 mt-4 w-full border border-2 p-3 rounded justify-center flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center mb-2">Filters</h1>
            <VerticalLine />
            <div className="w-full flex flex-col gap-3 md:items-start md:flex-row md:justify-evenly">
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
            <RemoveFilterButton
                paramsToRemove={['dayFrom', 'dayTo', 'dayOfWeek']}
                className='self-center'
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
