'use client'

import React, { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'

import { AvgTimeResponse } from '@/app/types'
import { chunkify } from '@/app/helpers/array'
import classNames from 'classnames'

type Props = {
    dataByAttraction?: AvgTimeResponse
}

type SingleTableProps = {
    data: {
        attraction: string
        avgWaitingTimeMinutes: number
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
    const columns = useMemo(
        () => [
            {
                Header: 'Attraction name',
                accessor: 'attraction' as const,
            },
            {
                Header: 'Average waiting time (min)',
                accessor: 'avgWaitingTimeMinutes' as const,
                Cell: ({ value }: { value: number }) =>
                    formatWaitingTime(value),
            },
        ],
        [],
    )

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable(
            {
                columns,
                data,
            },
            useSortBy,
        )

    return (
        <div className="overflow-x-auto w-full flex justify-center">
            <table {...getTableProps()} className="divide-y divide-gray-700">
                <thead className="bg-background-light">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps()}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                >
                                    {column.render('Header') as React.ReactNode}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody
                    {...getTableBodyProps()}
                    className="divide-y bg-background divide-gray-700"
                >
                    {rows.map((row) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell, index) => (
                                    <td
                                        {...cell.getCellProps()}
                                        className={classNames(
                                            'px-5 py-2.5 whitespace-nowrap text-xs text-white',
                                            index > 0 && 'text-right',
                                        )}
                                    >
                                        {cell.render('Cell') as React.ReactNode}
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
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
                avgWaitingTimeMinutes,
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
