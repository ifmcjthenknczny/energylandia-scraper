'use client'

import { AvgTimeByHourResponse, AvgTimeResponse } from '../types'
import { Day, Hour } from '../utils/date'
import React, { useEffect, useState } from 'react'

import AttractionWaitTimeTable from './stats/AttractionWaitTimeTable'
import { Filter } from '../types'
import Loader from './misc/Loader'
import { ReadonlyURLSearchParams } from 'next/navigation'
import WaitingTimeChart from './stats/AvgWaitingTimeByHourChart'
import axios from 'axios'
import { mapToSearchParamsObject } from './filters/helpers'
import { removeUndefinedOrNull } from '../utils/object'
import useBusy from '../hooks/useBusy'
import { useSearchParams } from 'next/navigation'

export function mapQueryToFilter(
    query?: ReadonlyURLSearchParams,
): Partial<Filter> {
    return removeUndefinedOrNull({
        dayFrom: query?.get('dayFrom') as Day | undefined,
        dayTo: query?.get('dayTo') as Day | undefined,
        hourFrom: query?.get('hourFrom') as Hour | undefined,
        hourTo: query?.get('hourTo') as Hour | undefined,
        dayOfWeek: query?.get('dayOfWeek')
            ? parseInt(query.get('dayOfWeek')!)
            : undefined,
    })
}

function DataWrapper() {
    const query = useSearchParams()
    const [dataByHour, setDataByHour] = useState<AvgTimeByHourResponse>()
    const [dataByAttraction, setDataByAttraction] = useState<AvgTimeResponse>()
    const filter = mapQueryToFilter(query)
    const fetchQuery = new URLSearchParams(
        mapToSearchParamsObject(filter),
    ).toString()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [isBusy, busyWrapper] = useBusy(true)

    useEffect(() => {
        const fetchData = busyWrapper(async (query: string) => {
            const dataByHour = (
                await axios.get<AvgTimeByHourResponse>(
                    `/api/stats/by-hour?${query}`,
                )
            ).data
            const dataByAttraction = (
                await axios.get<AvgTimeResponse>(`/api/stats?${query}`)
            ).data

            setDataByAttraction(dataByAttraction)
            setDataByHour(dataByHour)
        })
        try {
            fetchData(fetchQuery)
        } catch (err: any) {
            setErrorMessage(err.message as string)
        }
    }, [query])

    if (errorMessage) {
        return (
            <div className="w-full flex justify-center">
                There was a problem with fetching data: {errorMessage}
            </div>
        )
    }

    if (isBusy) {
        return <Loader />
    }

    return (
        <div>
            <WaitingTimeChart data={dataByHour} />
            <AttractionWaitTimeTable dataByAttraction={dataByAttraction} />
        </div>
    )
}

export default DataWrapper
