'use client'

import 'react-calendar/dist/Calendar.css'
import '../../styles/DayFilters.css'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Calendar from 'react-calendar'
import { FIRST_DAY_OF_DATA } from './Filters'
import { Filter } from '@/types'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { toDay } from '@/utils/date'
import utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

type Props = {
    filters: Filter
    handleFiltersChange: (diff: Filter) => void
}

const DayFilters = ({ filters, handleFiltersChange }: Props) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [value, setValue] = useState<Value>([
        filters.dayFrom ? new Date(filters.dayFrom) : null,
        filters.dayTo ? new Date(filters.dayTo) : null,
    ])

    const updateURL = (date: Value | null) => {
        const current = new URLSearchParams(
            Array.from(searchParams?.entries() || []),
        )
        if (Array.isArray(date)) {
            const [from, to] = date
            if (!from || !to) {
                return
            }
            current.set('dayFrom', toDay(dayjs(from).tz('Europe/Warsaw')))
            current.set('dayTo', toDay(dayjs(to).tz('Europe/Warsaw')))
        } else if (!date) {
            current.delete('dayFrom')
            current.delete('dayTo')
        } else {
            current.set('dayFrom', toDay(dayjs(date).tz('Europe/Warsaw')))
        }
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${query}`)
    }

    const handleChange = (value: Value | null) => {
        setValue(value)
        if (!value) {
            handleFiltersChange({ dayFrom: undefined, dayTo: undefined })
            updateURL(null)
            return
        }
        if (Array.isArray(value)) {
            const [from, to] = value
            handleFiltersChange({
                dayFrom: from ? toDay(from) : undefined,
                dayTo: to ? toDay(to) : undefined,
            })
            updateURL([from, to])
            return
        }
        const dayStringValue = toDay(value)
        handleFiltersChange({ dayFrom: dayStringValue, dayTo: dayStringValue })
        updateURL([value, new Date()])
    }

    useEffect(() => {
        if (searchParams?.size === 0) {
            setValue(null)
        }
    }, [searchParams])

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-300">
                Day range
            </label>
            <Calendar
                locale="en"
                onChange={handleChange}
                value={value}
                selectRange={true}
                className="rounded-md border border-gray-300 shadow-sm"
                minDate={new Date(FIRST_DAY_OF_DATA)}
                maxDate={new Date()}
            />
        </div>
    )
}

export default DayFilters
