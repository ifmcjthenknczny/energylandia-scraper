import React from 'react'
import classNames from 'classnames'

type Props = {
    header: React.ReactNode[]
    rowsData: React.ReactNode[][]
    className?: string
}

export default function Table({ header, rowsData, className }: Props) {
    return (
        <div
            className={classNames(
                'overflow-x-auto w-full flex justify-center',
                className,
            )}
        >
            <table className="divide-y divide-gray-700">
                <thead className="bg-gray-light dark:bg-gray-dark">
                    <tr>
                        {header.map((headerColumn, index) => (
                            <th
                                key={index}
                                className={classNames(
                                    'px-6 py-3 text-left text-xs font-medium text-font-dark uppercase tracking-wider',
                                    index === header.length - 1 && 'text-right',
                                )}
                            >
                                {headerColumn}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y bg-background-light dark:bg-background-dark divide-gray-700">
                    {rowsData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={classNames(
                                        'px-5 py-2.5 whitespace-nowrap text-xs text-font-light dark:text-font-dark',
                                        cellIndex === row.length - 1 &&
                                            'text-right',
                                    )}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
