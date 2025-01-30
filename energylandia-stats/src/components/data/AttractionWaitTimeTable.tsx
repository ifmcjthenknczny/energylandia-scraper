'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { AvgTimeResponse } from '@/types'
import Table from '../util/Table'
import { chunkify } from '@/utils/array'

type Props = {
    data?: AvgTimeResponse
}

type SingleTableProps = {
    data: {
        attraction: string
        avgWaitingTime: string
    }[]
}

const ONE_TABLE_WIDTH_PX = 480

function formatWaitingTime(waitingTimeMinutes: number) {
    const hours = Math.floor(waitingTimeMinutes / 60)
    const minutes = Math.floor(waitingTimeMinutes % 60)
    const seconds = Math.floor((waitingTimeMinutes - hours * 60 - minutes) * 60)

    if (waitingTimeMinutes < 1) {
        return `${seconds}s`
    }

    if (!hours) {
        return `${minutes}min ${seconds}s`
    }

    return `${hours}h ${minutes}min ${seconds}s`
}

const SingleAttractionWaitTimeTable = ({ data }: SingleTableProps) => {
    return (
        <Table
            header={['Attraction name', 'Average waiting time']}
            data={data.map((dataRow) => Object.values(dataRow))}
        />
    )
}

const AttractionWaitTimeTable = ({ data }: Props) => {
    const [screenWidth, setScreenWidth] = useState<number>(0)

    useEffect(() => {
        if (typeof window === undefined) {
            return
        }
        setScreenWidth(window.innerWidth)
    }, [])

    const tableColumnsCount = useMemo(
        () => Math.floor(screenWidth / ONE_TABLE_WIDTH_PX),
        [screenWidth],
    )

    const dataArray = useMemo(() => {
        if (!data || !Object.keys(data).length) {
            return []
        }
        return Object.entries(data).map(
            ([attraction, avgWaitingTimeMinutes]) => ({
                attraction,
                avgWaitingTime: formatWaitingTime(avgWaitingTimeMinutes),
            }),
        )
    }, [data])

    const dataChunks = useMemo(
        () =>
            chunkify(
                dataArray,
                Math.ceil(dataArray.length / tableColumnsCount),
            ),
        [dataArray, tableColumnsCount],
    )

    return (
        <div className="flex gap-3 flex-row py-8">
            {dataChunks.map((chunk, index) => (
                <SingleAttractionWaitTimeTable key={index} data={chunk} />
            ))}
        </div>
    )
}

export default AttractionWaitTimeTable
