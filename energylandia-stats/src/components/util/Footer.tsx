import React from 'react'

const GITHUB_URL = 'https://github.com/ifmcjthenknczny/energylandia-scraper'
const CREATOR = 'Maciej Konieczny'

export default function Footer() {
    return (
        <footer className="w-full border-t py-2 px-10 flex flex-col md:flex-row justify-center items-center md:gap-1 fixed bottom-0 left-0 z-10 bg-background">
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
