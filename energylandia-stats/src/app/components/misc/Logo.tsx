import Image from 'next/image'
import React from 'react'
import classnames from 'classnames'

type Props = {
    className?: string
}

// TODO: fix not working img

export default function Logo({ className }: Props) {
    return (
        <Image
            className={classnames(className)}
            src="https://energylandia.pl/wp-content/themes/plm/assets/img/logo-2024.png"
            alt="Energylandia"
        />
    )
}
