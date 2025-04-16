import { useRef } from 'react'

const DEFAULT_DELAY = 1000

export const useDebounced = (
    fn: (...args: any[]) => void,
    delay: number = DEFAULT_DELAY,
) => {
    const timeoutId = useRef<NodeJS.Timeout | null>(null)

    const debouncedFn = (...args: any[]) => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current)
        }

        timeoutId.current = setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            fn(...args)
        }, delay)
    }

    return debouncedFn
}
