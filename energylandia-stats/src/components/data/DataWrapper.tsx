'use client'

import AttractionWaitTimeTable from './AttractionWaitTimeTable'
import AttractionWaitingTimeByHourChart from './AttractionWaitingTimeByHourChart'
import { Props } from '@/pages'
import React from 'react'

function DataWrapper({ dataByHour, dataByAttraction, errorMessage }: Props) {
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
            <AttractionWaitingTimeByHourChart data={dataByHour} />
            <AttractionWaitTimeTable data={dataByAttraction} />
        </div>
    )
}

export default DataWrapper
