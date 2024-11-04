"use client";

import { AvgTimeByHourResponse, AvgTimeResponse } from '../types'
import { Day, Hour } from '../utils/date'
import React, {Suspense, useEffect, useState} from 'react'

import AttractionWaitTimeTable from './stats/AttractionWaitTimeTable';
import { Filter } from '../types'
import Loader from './misc/Loader'
import { ReadonlyURLSearchParams } from 'next/navigation'
import WaitingTimeChart from './stats/AvgWaitingTimeByHourChart'
import axios from 'axios'
import { mapToSearchParamsObject } from './filters/helpers'
import { removeUndefinedOrNull } from '../utils/object'
import { useSearchParams } from 'next/navigation'

export function mapQueryToFilter(query?: ReadonlyURLSearchParams): Partial<Filter> {
    return removeUndefinedOrNull({
      dayFrom: query?.get('dayFrom') as Day | undefined,
      dayTo: query?.get('dayTo') as Day | undefined,
      hourFrom: query?.get('hourFrom') as Hour | undefined,
      hourTo: query?.get('hourTo') as Hour | undefined,
      dayOfWeek: query?.get('dayOfWeek') ? parseInt(query.get('dayOfWeek')!) : undefined,
    });
  }
  
function DataWrapper() {
    const query = useSearchParams()
    const [dataByHour, setDataByHour] = useState<AvgTimeByHourResponse>()
    const [dataByAttraction, setDataByAttraction] = useState<AvgTimeResponse>()
    const filter = mapQueryToFilter(query)
    const fetchQuery = new URLSearchParams(mapToSearchParamsObject(filter)).toString();

    useEffect(() => {
        const fetchDataByHour = async () => {
          const response = await axios.get<AvgTimeByHourResponse>(`/api/stats/by-hour?${fetchQuery}`);
            setDataByHour(response.data);
        };
        const fetchDataByAttraction = async () => {
          const response = await axios.get<AvgTimeResponse>(`/api/stats?${fetchQuery}`);
            setDataByAttraction(response.data);
        };
        fetchDataByHour()
        fetchDataByAttraction()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])
    
  return (
    <div>
      <WaitingTimeChart data={dataByHour} />
      <AttractionWaitTimeTable dataByAttraction={dataByAttraction} />
    </div>
  )
}

export default function SuspensedDataWrapper() {
    return <Suspense fallback={<Loader />}>
        <DataWrapper />
    </Suspense>
}
