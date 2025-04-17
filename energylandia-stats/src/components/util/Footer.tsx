import { useEffect, useState } from 'react'

import React from 'react'
import classNames from 'classnames'

const GITHUB_URL = 'https://github.com/ifmcjthenknczny/energylandia-scraper'
const CREATOR = 'Maciej Konieczny'

export default function Footer() {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 100)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <footer
            className={classNames(
                'w-full border-t py-2 px-10 flex flex-col md:flex-row justify-center items-center md:gap-1 fixed bottom-0 left-0 z-10 bg-background-light dark:bg-background-dark text-sm transition-transform duration-500 ease-in-out',
                visible ? 'translate-y-0' : 'translate-y-full',
            )}
        >
            <p>
                © {new Date().getFullYear()} {CREATOR}. All rights reserved.{' '}
            </p>
            <p>
                <a
                    href={GITHUB_URL}
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub repository
                </a>
            </p>
        </footer>
    )
}
