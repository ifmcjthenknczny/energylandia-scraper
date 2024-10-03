import { AWS_CREDENTIALS_CONFIG } from "../../config";
import { AttractionWaitingTime } from "../../model/attractionWaitingTime.model";
import { Collection } from "mongodb";
import { SECRETS_NAME } from "../../config";
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import dotenv from "dotenv";
import { getSecretsFromAws } from "./secrets";
import { log } from "./log";
import mongoose from "mongoose";
import { waitingTimeCollection } from './mongo';

dotenv.config();

export type ScriptContext = {
  executionId: string;
  now: Date;
  collection: Collection<AttractionWaitingTime>
};

export async function initializeScriptContext(
  executionId: string,
): Promise<ScriptContext> {
  log(`Initializing script context: executionId=${executionId}.`);

  const secretsManager = new SecretsManagerClient(AWS_CREDENTIALS_CONFIG);
  const uri = process.env.MONGO_URI || (await getSecretsFromAws(SECRETS_NAME, secretsManager)).MONGO_URI

  const now = new Date();

  const collection = await waitingTimeCollection(uri)

  console.log(uri)

  log("Script context initialized.");
  return {
    executionId,
    now,
    collection
  };
}

export async function finalizeScriptContext(context: ScriptContext) {
  log(`Finalizing script context: executionId=${context.executionId}.`);

  await mongoose.connection.close()

  log("Script context finalized.");
  process.exit(0);
}
