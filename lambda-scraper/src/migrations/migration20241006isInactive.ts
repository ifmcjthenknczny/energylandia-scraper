import { ScriptContext } from '../context'
import { waitingTimeCollection } from '../client/attractionWaitingTime'

const migration20241006isInactive = async (context: ScriptContext) => {
    const waitingTime = await waitingTimeCollection(context.db)
    await waitingTime.updateMany({ isInactive: { $exists: true } }, [
        {
            $set: {
                isInactive: {
                    $cond: {
                        if: '$isInactive',
                        then: false,
                        else: true,
                    },
                },
            },
        },
    ])
}

export default migration20241006isInactive
