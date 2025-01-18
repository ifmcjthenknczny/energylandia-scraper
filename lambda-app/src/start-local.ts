import { ActionType, lambda } from './lambda-app'

const config = {
    action: ActionType.MIGRATION,
    rawEvent: null,
    executionId: 'local',
    runningLocal: true,
}

lambda(config)
