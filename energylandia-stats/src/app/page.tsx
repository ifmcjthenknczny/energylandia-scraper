'use client'

import DataWrapper from './components/DataWrapper'
import Filters from './components/filters/Filters'
import Loader from './components/misc/Loader'
import Logo from './components/misc/Logo'
import React from 'react'
import { Suspense } from 'react'

export default function Home() {
    return (
        <Suspense fallback={<Loader />}>
            <Logo className="py-8 px-20" />
            <Filters />
            <DataWrapper />
        </Suspense>
    )
}
