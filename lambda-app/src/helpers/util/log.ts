export function log(message: any) {
    console.log(JSON.stringify(message, null, 2))
}

export function logError(message: any) {
    console.error(JSON.stringify(message, null, 2))
}

export function logWarn(message: any) {
    console.warn(JSON.stringify(message, null, 2))
}
