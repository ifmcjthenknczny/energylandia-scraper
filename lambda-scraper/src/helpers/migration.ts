import {
    insertFailedMigration,
    insertSuccessMigration,
    isMigrationSuccessfullyProcessed,
} from '../client/migration'

import { ScriptContext } from '../context'
import { log } from 'console'
import { logError } from './util/log'

type MigrationFunction = (context: ScriptContext) => Promise<string>

export async function migration(
    context: ScriptContext,
    func: MigrationFunction,
) {
    const name = func.name
    log(`STARTED MIGRATION ${name}`)
    const isAlreadyProcessed = await isMigrationSuccessfullyProcessed(
        context.db,
        name,
    )
    if (isAlreadyProcessed) {
        logError(`MIGRATION OF NAME ${name} WAS ALREADY PROCESSED. CANCELLING`)
        return
    }
    try {
        const message = await func(context)
        await insertSuccessMigration(context.db, name, message || undefined)
    } catch (err: any) {
        logError(`MIGRATION OF NAME ${name} FAILED WITH MESSAGE ${err.message}`)
        await insertFailedMigration(context.db, name, err.message as string)
    }

    log(`FINISHED MIGRATION OF ${name}`)
}
