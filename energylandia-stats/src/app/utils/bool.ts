export function isFalsyExceptZero(value: unknown) {
    return !value && value !== 0
}