import Image from 'next/image'
import React from 'react'
import classnames from 'classnames'

type Props = {
    className?: string
}

// TODO: fix not working img

export default function Logo({ className }: Props) {
    return (
        <div
            className={classnames(
                'w-full flex justify-center flex-col items-center',
                className,
            )}
        >
            <Image
                className="mb-4"
                src="/logo.png"
                alt="Energylandia"
                width={800}
                height={100}
            />
            <div className="subtitle font-energylandia text-sm md:text-xl text-energylandia">
                WAITING TIMES
            </div>
        </div>
    )
}
