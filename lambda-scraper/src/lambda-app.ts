import { finalizeScriptContext, initializeScriptContext } from './context'
import { log, logError } from './helpers/util/log'

import getUniqueDatesDifference from './actions/uniqueDatesInWaitingTimes'
import { migration } from './helpers/migration'
import migration20250123deleteEmptyRecords from './migrations/migration20250123deleteEmptyRecords'
import { scrapeEnergylandiaOpeningHours } from './scrapers/openingHoursScraper'
import { scrapeEnergylandiaWaitingTimes } from './scrapers/waitingTimesScraper'

export enum ActionType {
    PING = 'PING',
    SCRAPE_WAITING_TIMES = 'SCRAPE_WAITING_TIMES',
    SCRAPE_OPENING_HOURS = 'SCRAPE_OPENING_HOURS',
    MIGRATION = 'MIGRATION',
    TEST = 'TEST',
}

interface AppConfig {
    action: ActionType
    executionId: string
    rawEvent: string | null
    runningLocal: boolean
}

export async function lambda(config: AppConfig) {
    log(`Starting execution: config=${JSON.stringify(config)}.`)
    const context = await initializeScriptContext(config.executionId)
    const migrationFunction = migration20250123deleteEmptyRecords

    switch (config.action) {
        case ActionType.PING:
            log('PONG')
            break
        case ActionType.SCRAPE_WAITING_TIMES:
            await scrapeEnergylandiaWaitingTimes(context)
            break
        case ActionType.SCRAPE_OPENING_HOURS:
            await scrapeEnergylandiaOpeningHours(context)
            break
        case ActionType.MIGRATION:
            await migration(context, migrationFunction)
            break
        case ActionType.TEST:
            await getUniqueDatesDifference(context)
            break
        default:
            logError(`Unknown action: action=${config.action}.`)
    }

    await finalizeScriptContext(context)
}
