import { Day, Hour } from '../utils/date'
import React, {Suspense, useEffect, useState} from 'react'

import { AvgTimeByHourResponse } from '../types'
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

    useEffect(() => {
    const filter = mapQueryToFilter(query)
        const fetchData = async () => {
          const query = new URLSearchParams(mapToSearchParamsObject(filter)).toString();
            const response = await axios.get<AvgTimeByHourResponse>(`/api/stats/by-hour?${query}`);
            setDataByHour(response.data);
        };
        fetchData()
    }, [query])
    
  return (
    <WaitingTimeChart data={dataByHour} />
  )
}

export default function SuspensedDataWrapper() {
    return <Suspense fallback={<Loader />}>
        <DataWrapper />
    </Suspense>
}

