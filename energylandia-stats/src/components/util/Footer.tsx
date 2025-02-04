import React from 'react'

const GITHUB_URL = 'https://github.com/ifmcjthenknczny/energylandia-scraper'
const CREATOR = 'Maciej Konieczny'

export default function Footer() {
    return (
        <footer className="w-full border-t pt-2 px-10 flex flex-col md:flex-row justify-center items-center md:gap-1">
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
