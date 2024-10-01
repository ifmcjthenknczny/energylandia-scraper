import { ActionType, lambda } from "./lambda-app";

const ping = {
  action: ActionType.PING,
  rawEvent: null,
  executionId: "local",
  runningLocal: true,
};
lambda(ping);
