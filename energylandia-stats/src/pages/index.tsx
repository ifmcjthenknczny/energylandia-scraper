import '../styles/globals.css'

import { AvgTimeByHourResponse, AvgTimeResponse, Filter } from '../types'
import { Day, Hour } from '../utils/date'

import DataWrapper from '../components/data/DataWrapper'
import Filters from '../components/filters/Filters'
import { GetServerSideProps } from 'next'
import Logo from '../components/util/Logo'
import React from 'react'
import { Suspense } from 'react'
import axios from 'axios'
import { filterSchema } from '@/schema'
import { mapToSearchParamsObject } from '../components/filters/helpers'
import { removeUndefinedOrNull } from '../utils/object'
import { validate } from '@/utils/validate'

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
    const CACHE_SECONDS = 24 * 60 * 60 // 1 day
    context.res.setHeader(
        'Cache-Control',
        `public, max-age=${CACHE_SECONDS}, immutable`,
    )

    const query = new URLSearchParams(
        Object.entries(context.query).map(([key, value]) =>
            [key, Array.isArray(value) ? value[0] : value].filter(Boolean),
        ) as string[][],
    )
    const filter = mapQueryToFilter(query)
    try {
        validate(filter, filterSchema)
    } catch (error: any) {
        return {
            props: {
                errorMessage: error.message,
            },
        }
    }
    const fetchQuery = new URLSearchParams(
        mapToSearchParamsObject(filter),
    ).toString()

    try {
        const dataByHour = (
            await axios.get<AvgTimeByHourResponse>(
                `${process.env.BASE_URL}/api/stats/by-hour?${fetchQuery}`,
            )
        ).data
        const dataByAttraction = (
            await axios.get<AvgTimeResponse>(
                `${process.env.BASE_URL}/api/stats?${fetchQuery}`,
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
                errorMessage: error?.response?.data?.error || 'Unknown error',
            },
        }
    }
}

const Home = ({ dataByHour, dataByAttraction, errorMessage }: Props) => {
    return (
        <Suspense>
            <Logo className="py-4 md:py-8 px-2 md:px-20" />
            <Filters />
            <DataWrapper
                dataByHour={dataByHour}
                dataByAttraction={dataByAttraction}
                errorMessage={errorMessage}
            />
        </Suspense>
    )
}

export default Home
