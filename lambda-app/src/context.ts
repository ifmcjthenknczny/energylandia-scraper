import { AWS_CREDENTIALS_CONFIG } from "./config";
import { SECRETS_NAME } from "./config";
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import dotenv from "dotenv";
import { getSecretsFromAws } from "./helpers/util/secrets";
import { log } from "./helpers/util/log";
import { mongo } from './client/mongo';
import mongoose from "mongoose";

dotenv.config();

export type ScriptContext = {
  executionId: string;
  now: Date;
  db: mongoose.mongo.Db
};

export async function initializeScriptContext(
  executionId: string,
): Promise<ScriptContext> {
  log(`Initializing script context: executionId=${executionId}.`);

  const secretsManager = new SecretsManagerClient(AWS_CREDENTIALS_CONFIG);
  const uri = process.env.MONGO_URI || (await getSecretsFromAws(SECRETS_NAME, secretsManager)).MONGO_URI

  const now = new Date();

  const db = await mongo(uri)

  log("Script context initialized.");
  return {
    executionId,
    now,
    db
  };
}

export async function finalizeScriptContext(context: ScriptContext) {
  log(`Finalizing script context: executionId=${context.executionId}.`);

  await mongoose.connection.close()

  log("Script context finalized.");
  // process.exit(0);
}
