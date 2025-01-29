import '../../../../styles/Loader.css'

import React from 'react'
import classNames from 'classnames'

type Props = {
    centered?: boolean
}

export default function Loader({ centered = true }: Props) {
    return (
        <div
            className={classNames(
                centered && 'flex justify-center w-full my-6',
            )}
        >
            <div className="loader" />
        </div>
    )
}
