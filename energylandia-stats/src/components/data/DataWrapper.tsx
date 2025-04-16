'use client'

import React, { useEffect, useState } from 'react'

import AttractionWaitTimeTable from './AttractionWaitTimeTable'
import AttractionWaitingTimeByHourChart from './AttractionWaitingTimeByHourChart'
import Loader from '../util/Loader'
import { Props } from '@/pages'
import { useRouter } from 'next/router'

const DEFAULT_SELECTED_ATTRACTIONS = [
    'Abyssus',
    'Formuła',
    'Hyperion',
    'Mayan',
    'Zadra',
]

function DataWrapper({ dataByHour, dataByAttraction, errorMessage }: Props) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedAttractions, setSelectedAttractions] = useState<string[]>(
        DEFAULT_SELECTED_ATTRACTIONS,
    )

    const handleAttractionChange = (attraction: string) => {
        setSelectedAttractions((prev) =>
            prev.includes(attraction)
                ? prev.filter((name) => name !== attraction)
                : [...prev, attraction],
        )
    }

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
        <div className="flex flex-col md:flex-row w-full h-full pb-8 md:pb-12">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <AttractionWaitingTimeByHourChart
                        data={dataByHour}
                        selectedAttractions={selectedAttractions}
                    />
                    <AttractionWaitTimeTable
                        data={dataByAttraction}
                        selectedAttractions={selectedAttractions}
                        handleAttractionChange={handleAttractionChange}
                    />
                </>
            )}
        </div>
    )
}

export default DataWrapper
