'use client'

import React, { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'

import { AvgTimeResponse } from '@/app/types'

type Props = {
    dataByAttraction?: AvgTimeResponse
}

function formatWaitingTime(waitingTimeMinutes: number) {
    const hours = Math.floor(waitingTimeMinutes / 60)
    const minutes = Math.floor(waitingTimeMinutes % 60)
    const seconds = Math.floor((waitingTimeMinutes - hours * 60 - minutes) * 60)

    if (waitingTimeMinutes < 1) {
        return `0min ${seconds}s`
    }

    if (!hours) {
        return `${minutes}min ${seconds}s`
    }

    return `${hours}h ${minutes}min ${seconds}s`
}

const AttractionWaitTimeTable = ({ dataByAttraction }: Props) => {
    const data = useMemo(() => {
        if (!dataByAttraction) {
            return []
        }
        return Object.entries(dataByAttraction).map(
            ([attraction, avgWaitingTimeMinutes]) => ({
                attraction,
                avgWaitingTimeMinutes,
            }),
        )
    }, [dataByAttraction])

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
                // initialState: {
                //     sortBy: [{ id: 'avgWaitingTimeMinutes', desc: true }],
                // },
            },
            useSortBy,
        )

    return (
        <div className="overflow-x-auto">
            <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
                <thead className="bg-gray-50 dark:bg-gray-800">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps()}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    {column.render('Header') as React.ReactNode}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody
                    {...getTableBodyProps()}
                    className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700"
                >
                    {rows.map((row) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td
                                        {...cell.getCellProps()}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
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

export default AttractionWaitTimeTable
