'use client'

import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'

import { useRouter, useSearchParams } from 'next/navigation'

import { Filter } from '@/types'
import { Hour } from '@/utils/date'
import React from 'react'
import TimePicker from 'react-time-picker'
import { useDebounced } from '@/hooks/useDebounced'

type Props = {
    filters: Filter
    handleFiltersChange: (diff: Filter) => void
}

const TimeFilters = ({ filters, handleFiltersChange }: Props) => {
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
            <span className="text-sm">Hour</span>
            <div className="flex flex-row items-center gap-3">
                <TimePicker
                    onChange={handleHourFromChange}
                    value={filters.hourFrom}
                    clearIcon={null}
                    className="mt-1 block w-full"
                    disableClock={true}
                    maxTime={'23:59'}
                />
                -
                <TimePicker
                    onChange={handleHourToChange}
                    value={filters.hourTo}
                    clearIcon={null}
                    className="mt-1 block w-full"
                    disableClock={true}
                    maxTime={'23:59'}
                />
            </div>
        </div>
    )
}

export default TimeFilters
