'use client'

import Filters from './components/filters/Filters'
import Logo from './components/misc/Logo'
import React from 'react'
import SuspensedDataWrapper from './components/DataWrapper'

export default function Home() {
    return (
        <>
            <Logo className="py-8 px-20" />
            <Filters />
            <SuspensedDataWrapper />
        </>
    )
}
