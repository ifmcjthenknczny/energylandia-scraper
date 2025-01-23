/* eslint-disable no-console */

export function log(message: any) {
    console.log(`LOG ${JSON.stringify(message, null, 2)}`)
}

export function logError(message: any) {
    console.error(`ERROR ${JSON.stringify(message, null, 2)}`)
}

export function logWarn(message: any) {
    console.warn(`WARN ${JSON.stringify(message, null, 2)}`)
}
