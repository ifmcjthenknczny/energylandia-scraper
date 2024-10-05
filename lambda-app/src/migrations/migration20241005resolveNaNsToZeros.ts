import { ScriptContext } from "../context"
import { log } from "../helpers/util/log"
import { waitingTimeCollection } from "../client/attractionWaitingTime"

const migration20241005resolveNaNsToZeros = async (context: ScriptContext) => {
    log('STARTED MIGRATION OF NANS')
    const collection = await waitingTimeCollection(context.db)
    const result = await collection.updateMany(
        { waitingTimeMinutes: NaN },
        { $set: { waitingTimeMinutes: 0 } }
      )
    log(`FINISHED MIGRATION OF NANS. TOTAL COUNT: ${result.modifiedCount}`)
}

export default migration20241005resolveNaNsToZeros