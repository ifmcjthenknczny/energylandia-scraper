'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

export const ThemeButton = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setTheme('dark')
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <button
            onClick={() =>
                setTheme(theme === 'dark' || !theme ? 'light' : 'dark')
            }
            className="absolute top-4 left-4 md:left-auto md:right-4 z-50
        p-2 rounded-lg shadow-md
        bg-background-dark dark:bg-background-light
        hover:scale-105 transition-transform"
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    )
}
