'use client'

import React, { useEffect, useState } from 'react'
import { bgColor, fontColor, gridlinesColor } from '../theme/helpers'

import { AvgTimeByHourResponse } from '@/types'
import { Chart } from 'react-google-charts'
import { Hour } from '@/utils/date'
import Loader from '../util/Loader'
import { useTheme } from 'next-themes'

type ChartData = Array<[string, ...(string | number)[]]>

type Props = {
    data?: AvgTimeByHourResponse
    selectedAttractions: string[]
}

const MOBILE_BREAKPOINT_PX = 768

const AttractionWaitingTimeByHourChart = ({
    data,
    selectedAttractions,
}: Props) => {
    const { theme } = useTheme()
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

    if (!data || !Object.keys(data).length) {
        return (
            <div className="w-full text-center h-full flex items-center justify-center">
                No data available for provided filters :'(
            </div>
        )
    }

    return (
        <div className="flex md:flex-row flex-grow flex-col">
            {selectedAttractions.length > 0 ? (
                <Chart
                    width={screenWidth < MOBILE_BREAKPOINT_PX ? '105%' : '100%'}
                    height={
                        screenWidth < MOBILE_BREAKPOINT_PX ? '400px' : '500px'
                    }
                    className="md:pr-2"
                    chartType="LineChart"
                    loader={<Loader />}
                    data={chartData}
                    options={{
                        hAxis: {
                            title: 'Hour',
                            minValue: 0,
                            textStyle: {
                                color: fontColor(theme),
                            },
                            titleTextStyle: {
                                color: fontColor(theme),
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
                                color: fontColor(theme),
                            },
                            titleTextStyle: {
                                color: fontColor(theme),
                            },
                            gridlines: {
                                color: gridlinesColor(theme),
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
                                color: fontColor(theme),
                            },
                        },
                        backgroundColor: bgColor(theme),
                        chartArea: {
                            backgroundColor: bgColor(theme),
                        },
                    }}
                />
            ) : (
                <div className="flex justify-center items-center w-full">
                    <span className="text-2xl">
                        Select attraction to show chart
                    </span>
                </div>
            )}
        </div>
    )
}

export default AttractionWaitingTimeByHourChart
