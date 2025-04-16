'use client'

import React, {useEffect, useState} from 'react'

import AttractionWaitTimeTable from './AttractionWaitTimeTable'
import AttractionWaitingTimeByHourChart from './AttractionWaitingTimeByHourChart'
import Loader from '../util/Loader'
import { Props } from '@/pages'
import { useRouter } from 'next/router'

function DataWrapper({ dataByHour, dataByAttraction, errorMessage }: Props) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const start = () => setIsLoading(true)
        const end = () => setIsLoading(false)

        router.events.on('routeChangeStart', start)
        router.events.on('routeChangeComplete', end)
        router.events.on('routeChangeError', end)

        return () => {
            router.events.off('routeChangeStart', start)
            router.events.off('routeChangeComplete', end)
            router.events.off('routeChangeError', end)
        }
    }, [router])

    if (errorMessage) {
        return (
            <div className="w-full flex justify-center">
                There was a problem with fetching data: {errorMessage}
            </div>
        )
    }

    if (!dataByHour || !dataByAttraction) {
        return (
            <div className="w-full flex justify-center">
                No data available for provided filters :'(
            </div>
        )
    }

    return (
        <div>
            {isLoading ? <Loader /> : <>
            <AttractionWaitingTimeByHourChart data={dataByHour} />
            <AttractionWaitTimeTable data={dataByAttraction} />
            </>}
            
        </div>
    )
}

export default DataWrapper
