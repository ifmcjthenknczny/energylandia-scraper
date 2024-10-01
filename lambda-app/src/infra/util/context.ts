import {AWS_CREDENTIALS_CONFIG, SECRETS_NAME} from './config';

import {SecretsManagerClient} from '@aws-sdk/client-secrets-manager';
import dotenv from 'dotenv';
import { log } from './log';

dotenv.config();

type ScriptContext = {
  executionId: string;
  now: Date;
//   dbClient: 
};

function createDbPool() {
    
}

export async function initializeScriptContext(
    executionId: string,
): Promise<ScriptContext> {
    log(`Initializing script context: executionId=${executionId}.`);

    const secretsManagerClient = new SecretsManagerClient(AWS_CREDENTIALS_CONFIG);

    const dbClient = await createDbPool(secretsManagerClient);

    const now = new Date();

    log('Script context initialized.');
    return {
        executionId,
        now,
        dbClient
    };
}

export async function finalizeScriptContext(context: ScriptContext) {
    log(`Finalizing script context: executionId=${context.executionId}.`);

    // Add finizaling logic here

    log('Script context finalized.');
}
