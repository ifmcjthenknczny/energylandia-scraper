import { ActionType, lambda } from "./lambda-app";

const config = {
  action: ActionType.SCRAPE_WAITING_TIMES,
  rawEvent: null,
  executionId: "local",
  runningLocal: true,
};

lambda(config);
