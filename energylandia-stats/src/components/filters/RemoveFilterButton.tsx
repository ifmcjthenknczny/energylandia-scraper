'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import React from 'react'
import classNames from 'classnames'

type Props = {
    paramsToRemove: string[]
    onRemoveParams?: () => void
    className?: string
}

const RemoveFilterButton = ({
    paramsToRemove,
    onRemoveParams,
    className,
}: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleRemoveParam = () => {
        if (searchParams?.size === 0) {
            return
        }
        onRemoveParams?.()
        const query = new URLSearchParams(
            Array.from(searchParams?.entries() || []),
        )

        for (const param of paramsToRemove) {
            query.delete(param)
        }

        if (query.size === 0) {
            router.push('/')
        } else {
            router.push(`?${query.toString()}`)
        }
    }

    return (
        <button
            onClick={handleRemoveParam}
            className={classNames(
                'bg-red-600 hover:bg-red-700 text-gray-200 font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 w-min',
                className,
            )}
            aria-label="Remove filter"
        >
            <div className="flex items-center justify-center w-full h-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </button>
    )
}

export default RemoveFilterButton
