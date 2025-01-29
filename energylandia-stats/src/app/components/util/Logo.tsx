import Image from 'next/image'
import React from 'react'
import classnames from 'classnames'

type Props = {
    className?: string
}

// TODO: fix not working img

export default function Logo({ className }: Props) {
    return (
        <div className="w-full flex justify-center">
            <Image
                className={classnames(className)}
                src="/logo.png"
                alt="Energylandia"
                width={800}
                height={100}
            />
        </div>
    )
}
