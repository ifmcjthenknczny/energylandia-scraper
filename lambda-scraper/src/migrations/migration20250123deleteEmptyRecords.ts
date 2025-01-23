import { ScriptContext } from '../context'
import { log } from 'console'
import { openingHoursCollection } from '../client/openingHours'
import { waitingTimeCollection } from '../client/attractionWaitingTime'

const migration20250123deleteEmptyRecords = async (context: ScriptContext) => {
    const openingHours = await (await openingHoursCollection(context.db))
        .find()
        .toArray()

    const waitingTimes = await waitingTimeCollection(context.db)

    let deletedRecords = 0
    let progressCount = 1

    for (const openingHour of openingHours) {
        log(`PROGRESS: ${progressCount}/${openingHours.length}`)
        if (!openingHour.isOpen) {
            const deletion = await waitingTimes.deleteMany({
                date: openingHour.date,
            })
            deletedRecords += deletion.deletedCount
            progressCount += 1
            continue
        }

        const deletion = await waitingTimes.deleteMany({
            date: openingHour.date,
            time: {
                $or: {
                    $lt: openingHour.openingHour,
                    $gt: openingHour.closingHour,
                },
            },
        })
        deletedRecords += deletion.deletedCount
        progressCount += 1
    }

    return `SUCCESSFULLY DELETED ${deletedRecords} RECORDS FROM WAITING TIME COLLECTION`
}

export default migration20250123deleteEmptyRecords
