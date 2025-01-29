'use client'

import React, { useMemo } from 'react'

import { AvgTimeResponse } from '@/types'
import Table from '../util/Table'
import { chunkify } from '@/utils/array'

type Props = {
    dataByAttraction?: AvgTimeResponse
}

type SingleTableProps = {
    data: {
        attraction: string
        avgWaitingTime: string
    }[]
}

const TABLE_COLUMNS_COUNT = 4

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

const AttractionWaitTimeTable = ({ dataByAttraction }: Props) => {
    const data = useMemo(() => {
        if (!dataByAttraction || !Object.keys(dataByAttraction).length) {
            return []
        }
        return Object.entries(dataByAttraction).map(
            ([attraction, avgWaitingTimeMinutes]) => ({
                attraction,
                avgWaitingTime: formatWaitingTime(avgWaitingTimeMinutes),
            }),
        )
    }, [dataByAttraction])

    const dataChunks = useMemo(
        () => chunkify(data, Math.ceil(data.length / TABLE_COLUMNS_COUNT)),
        [data],
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
