import { useState } from 'react'

export default function useBusy(
    initialBusyState = false,
): [boolean, <T extends (...args: unknown[]) => Promise<unknown>>(f: T) => T] {
    const [isBusy, setIsBusy] = useState(initialBusyState)

    function busyWrapper<T extends (...args: unknown[]) => Promise<unknown>>(f: T): T {
        return (async (...args: unknown[]) => {
            try {
                setIsBusy(true)
                await f(...args)
                setIsBusy(false)
            } catch {
                setIsBusy(false)
            }
        }) as T
    }

    return [isBusy, busyWrapper]
}
