import { ActionType, lambda } from './lambda-app'

const config = {
    action: ActionType.TEST,
    rawEvent: null,
    executionId: 'local',
    runningLocal: true,
}

lambda(config)
