'use client'

import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'

import { useRouter, useSearchParams } from 'next/navigation'

import { FilterSubcomponentProps } from './Filters'
import { Hour } from '@/utils/date'
import React from 'react'
import TimePicker from 'react-time-picker'
import { useDebounced } from '@/hooks/useDebounced'

type HourPickerProps = {
    onChange: (...args: any[]) => void
    value: Hour | undefined
}

const HourPicker = ({ value, onChange }: HourPickerProps) => {
    return (
        <TimePicker
            onChange={onChange}
            value={value}
            clearIcon={null}
            className="block w-min text-center text-xl bg-gray-light dark:bg-gray-dark border border-white text-font-dark"
            disableClock={true}
            minTime={'00:00'}
            maxTime={'23:59'}
        />
    )
}

const HourFilters = ({
    filters,
    handleFiltersChange,
}: FilterSubcomponentProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const updateURL = (param: string, value: string | null) => {
        const current = new URLSearchParams(
            Array.from(searchParams?.entries() || []),
        )
        if (value) {
            current.set(param, value)
        } else {
            current.delete(param)
        }
        const search = current.toString()
        if (!search) {
            router.push('/')
            return
        }
        const query = search ? `?${search}` : ''
        router.push(`${query}`)
    }

    const handleHourFromChange = useDebounced((value: string | null) => {
        handleFiltersChange({ hourFrom: value ? (value as Hour) : undefined })
        updateURL('hourFrom', value)
    })

    const handleHourToChange = useDebounced((value: string | null) => {
        handleFiltersChange({ hourTo: value ? (value as Hour) : undefined })
        updateURL('hourTo', value)
    })

    return (
        <div className="flex flex-col">
            <span className="text-sm text-font-light dark:text-font-dark">
                Hour range
            </span>
            <div className="flex flex-row items-center gap-3 mt-1">
                <HourPicker
                    value={filters.hourFrom}
                    onChange={handleHourFromChange}
                />
                -
                <HourPicker
                    value={filters.hourTo}
                    onChange={handleHourToChange}
                />
            </div>
        </div>
    )
}

export default HourFilters
