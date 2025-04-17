'use client'

import React, { useMemo, useState } from 'react'

import { AvgTimeResponse } from '@/types'
import Pagination from '../util/Pagination'
import Table from '../util/Table'
import { chunkify } from '@/utils/array'

type Props = {
    data?: AvgTimeResponse
    handleAttractionChange: (attraction: string) => void
    selectedAttractions: string[]
}

type SingleTableProps = {
    data: {
        attraction: string
        avgWaitingTime: string
    }[]
    handleAttractionChange: (attraction: string) => void
    selectedAttractions: string[]
}

type CheckboxProps = {
    attractionName: string
    selectedAttractions: string[]
    handleAttractionChange: (attraction: string) => void
}

const DATA_CHUNK_LENGTH = 10

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

const SelectAttractionCheckbox = ({
    attractionName,
    selectedAttractions,
    handleAttractionChange,
}: CheckboxProps) => {
    return (
        <input
            className="mr-1"
            type="checkbox"
            checked={selectedAttractions.includes(attractionName)}
            onChange={() => handleAttractionChange(attractionName)}
        />
    )
}

const SingleAttractionWaitTimeTable = ({
    data,
    selectedAttractions,
    handleAttractionChange,
}: SingleTableProps) => {
    return (
        <Table
            header={['', 'Attraction name', 'Average waiting time']}
            rowsData={data.map((dataRow) => [
                <SelectAttractionCheckbox
                    selectedAttractions={selectedAttractions}
                    handleAttractionChange={handleAttractionChange}
                    attractionName={dataRow.attraction}
                />,
                ...Object.values(dataRow),
            ])}
        />
    )
}

const AttractionWaitTimeTable = ({
    data,
    selectedAttractions,
    handleAttractionChange,
}: Props) => {
    const [page, setPage] = useState(1)

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
        () => chunkify(dataArray, DATA_CHUNK_LENGTH),
        [dataArray.length],
    )

    if (!data || !Object.keys(data).length) {
        return null
    }

    return (
        <div className="flex gap-3 flex-col pb-4 md:pb-0 items-center">
            <SingleAttractionWaitTimeTable
                data={dataChunks[page - 1]}
                selectedAttractions={selectedAttractions}
                handleAttractionChange={handleAttractionChange}
            />
            <Pagination
                currentPage={page}
                totalPages={dataChunks.length}
                onPageChange={setPage}
            />
        </div>
    )
}

export default AttractionWaitTimeTable
