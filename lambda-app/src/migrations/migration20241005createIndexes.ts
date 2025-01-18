import { ScriptContext } from '../context'
import dayjs from 'dayjs'
import { log } from '../helpers/util/log'
import { migrationCollection } from '../client/migration'
import { openingHoursCollection } from '../client/openingHours'
import { waitingTimeCollection } from '../client/attractionWaitingTime'

const migration20241005createIndexesAndMigration = async (
    context: ScriptContext,
) => {
    log('STARTED MIGRATION OF INDEXES AND CREATE MIGRATION COLLECTION')
    const waitingTime = await waitingTimeCollection(context.db)
    const openingHours = await openingHoursCollection(context.db)
    const migrations = await migrationCollection(context.db)

    await migrations.insertOne({
        name: 'migration20241005resolveNaNsToZeros',
        message: 'FINISHED MIGRATION OF NANS. TOTAL COUNT: 3',
        isSuccess: true,
        processedAt: dayjs().subtract(40, 'minute').toDate(),
    })

    migrations.createIndex({ name: 1, isSuccess: 1, processedAt: 1 })
    waitingTime.createIndex({ date: 1, time: 1 })
    waitingTime.createIndex({ attractionName: 1 })
    waitingTime.createIndex({ scrapedAt: 1 })
    waitingTime.createIndex({ date: 1, attractionName: 1, time: 1 })
    waitingTime.createIndex({ dayOfWeek: 1 })
    openingHours.createIndex({ date: 1 })
    openingHours.createIndex({ date: 1, isOpen: 1 })
    openingHours.createIndex({ seasonName: 1 })
    openingHours.createIndex({ scrapedAt: 1 })

    return `FINISHED CREATION OF INDEXES.`
}

export default migration20241005createIndexesAndMigration
