'use client'

import { Day, Hour } from '@/utils/date'
import React, { useEffect, useState } from 'react'

import DayFilters from './DayFilters'
import DayOfWeekFilter from './DayOfWeekFilter'
import { Filter } from '@/types'
import RemoveFilterButton from './RemoveFilterButton'
import TimeFilters from './TimeFilters'
import VerticalLine from '../util/VerticalLine'
import { isFalsyExceptZero } from '@/utils/bool'
import { useSearchParams } from 'next/navigation'

export const FIRST_DAY_OF_DATA = '2024-10-05'

const Filters = () => {
    const searchParams = useSearchParams()
    const [filters, setFilters] = useState<Filter>({})

    const handleFiltersChange = (diff: Filter) => {
        setFilters((prev) => ({ ...prev, ...diff }))
    }

    useEffect(() => {
        const dayFrom = searchParams?.get('dayFrom') as Day | undefined
        const dayTo = searchParams?.get('dayTo') as Day | undefined
        const dayOfWeek = searchParams?.get('dayOfWeek') as string | undefined
        const hourFrom = searchParams?.get('hourFrom') as Hour | undefined
        const hourTo = searchParams?.get('hourTo') as Hour | undefined

        handleFiltersChange({
            dayFrom,
            dayTo,
            dayOfWeek: isFalsyExceptZero(dayOfWeek)
                ? undefined
                : parseInt(dayOfWeek as string, 10),
            hourFrom,
            hourTo,
        })
    }, [searchParams])

    return (
        <div className="mb-8 mt-4 w-full border border-2 p-3 rounded justify-center flex flex-col items-center">
            <div className="flex gap-2 flex-col items-center mb-2">
                <h1 className="text-2xl font-bold text-center">Filters</h1>
                <RemoveFilterButton
                    paramsToRemove={['dayFrom', 'dayTo', 'dayOfWeek']}
                    className="self-center"
                />
            </div>
            <VerticalLine />
            <div className="w-full flex flex-col gap-3 md:items-start md:flex-row md:justify-evenly">
                <DayOfWeekFilter
                    filters={filters}
                    handleFiltersChange={handleFiltersChange}
                />
                <DayFilters
                    filters={filters}
                    handleFiltersChange={handleFiltersChange}
                />
                <TimeFilters
                    filters={filters}
                    handleFiltersChange={handleFiltersChange}
                />
            </div>
        </div>
    )
}

export default Filters
