import dotenv from "dotenv";
import { log } from "./log";

dotenv.config();

type ScriptContext = {
  executionId: string;
  now: Date;
  //   dbClient:
};

export async function initializeScriptContext(
  executionId: string,
): Promise<ScriptContext> {
  log(`Initializing script context: executionId=${executionId}.`);

  // const secretsManagerClient = new SecretsManagerClient(AWS_CREDENTIALS_CONFIG);

  const now = new Date();

  log("Script context initialized.");
  return {
    executionId,
    now,
  };
}

export async function finalizeScriptContext(context: ScriptContext) {
  log(`Finalizing script context: executionId=${context.executionId}.`);

  // Add finizaling logic here

  log("Script context finalized.");
}
