import React from 'react'
import classNames from 'classnames'

type Props = {
    header: React.ReactNode[]
    data: React.ReactNode[][]
}

export default function Table({ header, data }: Props) {
    return (
        <div className="overflow-x-auto w-full flex justify-center">
            <table className="divide-y divide-gray-700">
                <thead className="bg-background-light">
                    <tr>
                        {header.map((headerColumn, index) => (
                            <th
                                key={index}
                                className={classNames(
                                    'px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider',
                                    index === header.length - 1 && 'text-right',
                                )}
                            >
                                {headerColumn}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y bg-background divide-gray-700">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={classNames(
                                        'px-5 py-2.5 whitespace-nowrap text-xs text-white',
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
