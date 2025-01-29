import '../../styles/globals.css'

import { AvgTimeByHourResponse, AvgTimeResponse, Filter } from '../app/types'
import { Day, Hour } from '../app/utils/date'

import DataWrapper from '../app/components/DataWrapper'
import Filters from '../app/components/filters/Filters'
import { GetServerSideProps } from 'next'
import Logo from '../app/components/util/Logo'
import React from 'react'
import axios from 'axios'
import { mapToSearchParamsObject } from '../app/components/filters/helpers'
import { removeUndefinedOrNull } from '../app/utils/object'

export type Props = {
    dataByHour?: AvgTimeByHourResponse
    dataByAttraction?: AvgTimeResponse
    errorMessage?: string
}

export function mapQueryToFilter(query: URLSearchParams): Partial<Filter> {
    return removeUndefinedOrNull({
        dayFrom: query.get('dayFrom') as Day | undefined,
        dayTo: query.get('dayTo') as Day | undefined,
        hourFrom: query.get('hourFrom') as Hour | undefined,
        hourTo: query.get('hourTo') as Hour | undefined,
        dayOfWeek: query.get('dayOfWeek')
            ? parseInt(query.get('dayOfWeek')!)
            : undefined,
    })
}

export const getServerSideProps: GetServerSideProps<Props> = async (
    context,
) => {
    const query = new URLSearchParams(
        Object.entries(context.query).map(([key, value]) =>
            [key, Array.isArray(value) ? value[0] : value].filter(Boolean),
        ) as string[][],
    )
    const filter = mapQueryToFilter(query)
    const fetchQuery = new URLSearchParams(
        mapToSearchParamsObject(filter),
    ).toString()
    const baseUrl = process.env.__NEXT_PRIVATE_ORIGIN

    try {
        const dataByHour = (
            await axios.get<AvgTimeByHourResponse>(
                `${baseUrl}/api/stats/by-hour?${fetchQuery}`,
            )
        ).data
        const dataByAttraction = (
            await axios.get<AvgTimeResponse>(
                `${baseUrl}/api/stats?${fetchQuery}`,
            )
        ).data

        return {
            props: {
                dataByHour,
                dataByAttraction,
            },
        }
    } catch (error: any) {
        return {
            props: {
                errorMessage: error.message,
            },
        }
    }
}

const Home = ({ dataByHour, dataByAttraction, errorMessage }: Props) => {
    return (
        <>
            <Logo className="py-8 px-20" />
            <Filters />
            <DataWrapper
                dataByHour={dataByHour}
                dataByAttraction={dataByAttraction}
                errorMessage={errorMessage}
            />
        </>
    )
}

export default Home
