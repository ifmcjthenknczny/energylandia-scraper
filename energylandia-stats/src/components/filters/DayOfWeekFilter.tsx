'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { FilterSubcomponentProps } from './Filters'
import React from 'react'
import { isFalsyExceptZero } from '@/utils/bool'

const daysOfWeek = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' },
]

type OptionProps = {
    value?: number
    label: string
}

const WeekdayOption = ({ value, label }: OptionProps) => (
    <option
        className="text-xs dark:bg-gray-dark bg-gray-light cursor-pointer"
        value={isFalsyExceptZero(value) ? '' : value}
    >
        {label}
    </option>
)

const DayOfWeekFilter = ({
    filters,
    handleFiltersChange,
}: FilterSubcomponentProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        const newDayOfWeek = isFalsyExceptZero(value)
            ? undefined
            : parseInt(value, 10)

        handleFiltersChange({ dayOfWeek: newDayOfWeek })
        updateURL(newDayOfWeek)
    }

    const updateURL = (dayOfWeek: number | undefined) => {
        const current = new URLSearchParams(
            Array.from(searchParams?.entries() || []),
        )
        if (dayOfWeek !== undefined) {
            current.set('dayOfWeek', dayOfWeek.toString())
        } else {
            current.delete('dayOfWeek')
        }
        const search = current.toString()
        if (!search) {
            router.push('/')
            return
        }
        router.push(`?${search}`)
    }

    return (
        <div className="flex flex-col space-y-2">
            <label htmlFor="dayOfWeek" className="text-sm font-medium">
                Weekday
            </label>
            <select
                id="dayOfWeek"
                value={
                    isFalsyExceptZero(filters.dayOfWeek)
                        ? ''
                        : (filters.dayOfWeek as number)
                }
                onChange={handleChange}
                className="mt-1 block w-full rounded-md shadow-sm bg-gray-light dark:bg-gray-dark border border-white p-2 text-font-dark"
            >
                {daysOfWeek.map((day) => (
                    <WeekdayOption
                        key={day.value}
                        value={day.value}
                        label={day.label}
                    />
                ))}
                <WeekdayOption label="All weekdays" value={undefined} />
            </select>
        </div>
    )
}

export default DayOfWeekFilter
