'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import React from 'react'
import { isFalsyExceptZero } from '@/app/utils/bool'

type Props = {
    dayOfWeek: number | null
    onDayOfWeekChange: (dayOfWeek: number | null) => void
}

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

const Option = ({ value, label }: OptionProps) => (
    <option
        className="text-xs text-gray-500 bg-gray-900"
        value={isFalsyExceptZero(value) ? '' : value}
    >
        {label}
    </option>
)

const DayOfWeekFilter = ({ dayOfWeek, onDayOfWeekChange }: Props) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        const newDayOfWeek = isFalsyExceptZero(value)
            ? null
            : parseInt(value, 10)

        onDayOfWeekChange(newDayOfWeek)
        updateURL(newDayOfWeek)
    }

    const updateURL = (dayOfWeek: number | null) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        if (dayOfWeek !== null) {
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
            <label
                htmlFor="dayOfWeek"
                className="text-sm font-medium text-gray-700"
            >
                Day of Week
            </label>
            <select
                id="dayOfWeek"
                value={
                    isFalsyExceptZero(dayOfWeek) ? '' : (dayOfWeek as number)
                }
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-900 p-2"
            >
                <Option label="All weekdays" />

                {daysOfWeek.map((day) => (
                    <Option
                        key={day.value}
                        value={day.value}
                        label={day.label}
                    />
                ))}
            </select>
        </div>
    )
}

export default DayOfWeekFilter
