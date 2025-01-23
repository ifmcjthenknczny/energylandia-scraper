import { ScriptContext } from '../context'
import { openingHoursCollection } from '../client/openingHours'
import { waitingTimeCollection } from '../client/attractionWaitingTime'

const migration20250123deleteEmptyRecords = async (context: ScriptContext) => {
    const openingHours = await (await openingHoursCollection(context.db))
        .find()
        .toArray()

    const waitingTimes = await waitingTimeCollection(context.db)

    let deletedRecords = 0

    for (const openingHour of openingHours) {
        if (!openingHour.isOpen) {
            const deletion = await waitingTimes.deleteMany({
                date: openingHour.date,
            })
            deletedRecords += deletion.deletedCount
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
    }

    return `SUCCESSFULLY DELETED ${deletedRecords} RECORDS FROM WAITING TIME COLLECTION`
}

export default migration20250123deleteEmptyRecords
