'use client'

import React, { useEffect, useState } from 'react'

import { AvgTimeByHourResponse } from '@/app/types'
import { Chart } from 'react-google-charts'
import { Hour } from '@/app/utils/date'
import Loader from '../misc/Loader'
import useBusy from '@/app/hooks/useBusy'

type ChartData = Array<[string, ...(string | number)[]]>

type Props = {
    data?: AvgTimeByHourResponse
}

const DEFAULT_SELECTED_ATTRACTIONS = [
    'Abyssus',
    'Formuła',
    'Hyperion',
    'Mayan',
    'Zadra',
]

const WaitingTimeChart = ({ data }: Props) => {
    const [selectedAttractions, setSelectedAttractions] = useState<string[]>(
        DEFAULT_SELECTED_ATTRACTIONS,
    )
    const [chartData, setChartData] = useState<ChartData>([
        ['Hour', ...selectedAttractions],
    ])
    const [isBusy, busyWrapper] = useBusy()

    useEffect(() => {
        const handleDataChangeToChart = busyWrapper(
            async (data?: AvgTimeByHourResponse) => {
                if (!data) {
                    return undefined
                }

                const newChartData: ChartData = [
                    ['Hour', ...selectedAttractions],
                ]

                const hours = Object.keys(data?.[selectedAttractions[0]] || {})

                hours.forEach((hour) => {
                    const row: ChartData[number] = [hour]
                    selectedAttractions.forEach((attraction) => {
                        row.push(data[attraction]?.[hour as Hour] || 0)
                    })
                    newChartData.push(row)
                })

                setChartData(newChartData)
            },
        )
        handleDataChangeToChart(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, selectedAttractions.length, selectedAttractions])

    const handleAttractionChange = (attraction: string) => {
        setSelectedAttractions((prev) =>
            prev.includes(attraction)
                ? prev.filter((name) => name !== attraction)
                : [...prev, attraction],
        )
    }

    return (
        <div className="pb-6">
            <h1 className="text-xl my-4 text-center">
                Waiting Time by Attraction
            </h1>
            <div className="flex flex-row">
                {!!data && Object.keys(data).length > 0 && (
                    <div className="flex flex-col gap-1 max-h-[400px] overflow-y-scroll text-xs mx-2 p-2 border border-2">
                        {Object.keys(data).map((attractionName) => (
                            <label key={attractionName}>
                                <input
                                    className="mr-1"
                                    type="checkbox"
                                    checked={selectedAttractions.includes(
                                        attractionName,
                                    )}
                                    onChange={() =>
                                        handleAttractionChange(attractionName)
                                    }
                                />
                                {attractionName}
                            </label>
                        ))}
                    </div>
                )}
                {selectedAttractions.length > 0 && (
                    <Chart
                        width={'100%'}
                        height={'400px'}
                        className="pr-2"
                        chartType="LineChart"
                        loader={<Loader />}
                        data={chartData}
                        options={{
                            hAxis: {
                                title: 'Hour',
                                minValue: 0,
                            },
                            vAxis: {
                                title: 'Waiting Time (minutes)',
                                minValue: 0,
                            },
                            series: selectedAttractions.reduce(
                                (acc, name, index) => {
                                    acc[index] = { curveType: 'function' }
                                    return acc
                                },
                                {} as Record<number, { curveType: string }>,
                            ),
                            legend: { position: 'right' },
                        }}
                    />
                )}
                {!data ||
                    (!Object.keys(data).length && !isBusy && (
                        <div className="w-full text-center">
                            No data for provided filters
                        </div>
                    ))}
                {isBusy && <Loader />}
            </div>
        </div>
    )
}

export default WaitingTimeChart
