'use client'

import React, { useEffect, useState } from 'react'

import { AvgTimeByHourResponse } from '@/types'
import { Chart } from 'react-google-charts'
import { Hour } from '@/utils/date'
import Loader from '../util/Loader'

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

const MOBILE_BREAKPOINT_PX = 768

const AttractionWaitingTimeByHourChart = ({ data }: Props) => {
    const [selectedAttractions, setSelectedAttractions] = useState<string[]>(
        DEFAULT_SELECTED_ATTRACTIONS,
    )
    const [screenWidth, setScreenWidth] = useState<number>(0)
    const [chartData, setChartData] = useState<ChartData>([
        ['Hour', ...selectedAttractions],
    ])

    useEffect(() => {
        const handleDataChangeToChart = async (
            data?: AvgTimeByHourResponse,
        ) => {
            if (!data) {
                return undefined
            }

            const newChartData: ChartData = [['Hour', ...selectedAttractions]]

            const hours = Object.keys(data?.[selectedAttractions[0]] || {})

            hours.forEach((hour) => {
                const row: ChartData[number] = [hour]
                selectedAttractions.forEach((attraction) => {
                    row.push(data[attraction]?.[hour as Hour] || 0)
                })
                newChartData.push(row)
            })

            setChartData(newChartData)
        }
        handleDataChangeToChart(data)
    }, [data, selectedAttractions.length, selectedAttractions])

    useEffect(() => {
        if (typeof window === undefined) {
            return
        }
        setScreenWidth(window.innerWidth)
    }, [])

    const handleAttractionChange = (attraction: string) => {
        setSelectedAttractions((prev) =>
            prev.includes(attraction)
                ? prev.filter((name) => name !== attraction)
                : [...prev, attraction],
        )
    }

    if (!data || !Object.keys(data).length) {
        return (
            <div className="w-full text-center h-full flex items-center justify-center">
                No data available for provided filters :'(
            </div>
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
                        {Object.keys(data).map((attractionName, index) => (
                            <label key={index}>
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
                                textStyle: {
                                    color: '#ffffff',
                                },
                                titleTextStyle: {
                                    color: '#ffffff',
                                },
                            },
                            vAxis: {
                                title: 'Waiting Time (minutes)',
                                minValue: 0,
                                baseline: 0,
                                viewWindow: {
                                    min: 0,
                                },
                                textStyle: {
                                    color: '#ffffff',
                                },
                                titleTextStyle: {
                                    color: '#ffffff',
                                },
                                gridlines: {
                                    color: '#2f2f2f',
                                },
                                minorGridlines: {
                                    count: 0,
                                },
                            },
                            series: selectedAttractions.reduce(
                                (acc, name, index) => {
                                    acc[index] = { curveType: 'function' }
                                    return acc
                                },
                                {} as Record<number, { curveType: string }>,
                            ),
                            legend: {
                                position:
                                    screenWidth < MOBILE_BREAKPOINT_PX
                                        ? 'bottom'
                                        : 'right',
                                textStyle: {
                                    color: '#ffffff',
                                },
                            },
                            backgroundColor: '#0a0a0a',
                            chartArea: {
                                backgroundColor: '#0a0a0a',
                            },
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default AttractionWaitingTimeByHourChart
