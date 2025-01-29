/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react'

export default function useBusy(
    initialBusyState = false,
): [boolean, <T extends (...args: any[]) => any>(f: T) => T] {
    const [isBusy, setIsBusy] = useState(initialBusyState)

    function busyWrapper<T extends (...args: any[]) => any>(f: T): T {
        return (async (...args: any[]) => {
            try {
                setIsBusy(true)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                await f(...args)
                setIsBusy(false)
            } catch {
                setIsBusy(false)
            }
        }) as T
    }

    return [isBusy, busyWrapper]
}
