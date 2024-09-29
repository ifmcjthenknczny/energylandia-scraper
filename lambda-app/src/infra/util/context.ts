import {AWS_CREDENTIALS_CONFIG, DATABASE_SECRETS_NAME, SITE_SECRETS_NAME, WAREHOUSE_SECRETS_NAME} from './config';
import {
    SellerWithSpApiClient,
    getAllSellersWithSpApiClients
} from './spApiClient';
import {getBaseSpApiCredentials, getSecretsFromAws} from './secrets';
import knex, {Knex} from 'knex';

import {CognitoIdentityServiceProvider} from 'aws-sdk';
import {DynamoClient} from './dynamo-client';
import {Pool} from 'pg';
import {SecretsManagerClient} from '@aws-sdk/client-secrets-manager';
import {Ses} from './ses';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { log } from './log';

dotenv.config();

type SmallScriptContext = {
  executionId: string;
  now: Date;
  warehouseClient: Pool;
  dbClient: Knex
};

export type ScriptContext = SmallScriptContext & {
  dynamoClient: DynamoClient;
  vendors: SellerWithSpApiClient[];
  secretsManagerClient: SecretsManagerClient;
  ses: Ses;
};

async function createWarehousePool(
    secretsManagerClient: SecretsManagerClient
): Promise<Pool> {
    const secrets = await getSecretsFromAws(
        WAREHOUSE_SECRETS_NAME,
        secretsManagerClient
    );

    const postgres = new Pool({
        host: secrets.WAREHOUSE_HOST || process.env.WAREHOUSE_HOST,
        port: Number(secrets.WAREHOUSE_PORT) || Number(process.env.WAREHOUSE_PORT),
        user: secrets.WAREHOUSE_USERNAME || process.env.WAREHOUSE_USERNAME,
        password: secrets.WAREHOUSE_PASSWORD || process.env.WAREHOUSE_PASSWORD,
        database: secrets.WAREHOUSE_NAME || process.env.WAREHOUSE_NAME
    });

    return postgres;
}

async function createDbPool(
    secretsManagerClient: SecretsManagerClient
): Promise<Knex> {
    const secrets = await getSecretsFromAws(
        DATABASE_SECRETS_NAME,
        secretsManagerClient
    );

    const postgres = knex({
        client: 'pg',
        connection: {
            host: secrets.DATABASE_HOST || process.env.DATABASE_HOST,
            user: secrets.DATABASE_USERNAME || process.env.DATABASE_USERNAME,
            password: secrets.DATABASE_PASSWORD || process.env.DATABASE_PASSWORD,
            database: secrets.DATABASE_NAME || process.env.DATABASE_NAME
        }
    });

    return postgres;
}

function computeSecretHash(
    email: string,
    clientId: string,
    clientSecret: string
): string {
    const message = email + clientId;
    const hmac = crypto.createHmac('sha256', clientSecret);
    hmac.update(message);
    const hash = hmac.digest('base64');
    return hash;
}


export async function getBotAccountAccessToken(context: ScriptContext): Promise<string> {
    const secrets = await getSecretsFromAws(
        SITE_SECRETS_NAME,
        context.secretsManagerClient
    );
    const cognito = new CognitoIdentityServiceProvider({
        region: secrets.AWS_REGION,
        accessKeyId: secrets.AWS_ACCESS_KEY_ID,
        secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY
    });

    const authParameters = {
        USERNAME: secrets.PDF_BOT_EMAIL,
        PASSWORD: secrets.PDF_BOT_PASSWORD,
        SECRET_HASH: computeSecretHash(
            secrets.PDF_BOT_EMAIL,
            secrets.COGNITO_CLIENT_ID,
            secrets.COGNITO_CLIENT_SECRET
        )
    };

    const response = await cognito
        .initiateAuth({
            ClientId: secrets.COGNITO_CLIENT_ID,
            AuthFlow: 'USER_PASSWORD_AUTH',
            AuthParameters: authParameters
        })
        .promise();

    const accessToken = response?.AuthenticationResult?.AccessToken;

    if (!accessToken) {
        throw new Error('Have not received token');
    }
    return accessToken;
}

export async function getSenderMailAddress(secretsManagerClient: SecretsManagerClient): Promise<string | undefined> {
    const secrets = await getSecretsFromAws(
        SITE_SECRETS_NAME,
        secretsManagerClient
    );

    return secrets.SENDER_MAIL_ADDRESS || process.env.SENDER_MAIL_ADDRESS;
}

export async function initializeScriptContext(
    executionId: string,
    onlyActiveVendors = true
): Promise<ScriptContext> {
    log(`Initializing script context: executionId=${executionId}.`);

    const dynamoClient = DynamoClient.create();
    const secretsManagerClient = new SecretsManagerClient(AWS_CREDENTIALS_CONFIG);

    const warehouseClient = await createWarehousePool(secretsManagerClient);
    const dbClient = await createDbPool(secretsManagerClient);

    const vendors = await getAllSellersWithSpApiClients(
        await getBaseSpApiCredentials(),
        warehouseClient,
        onlyActiveVendors
    );

    log(
        `Found ${vendors.length}${
            onlyActiveVendors ? ' not paused' : ''
        } sellers with SP API clients`
    );

    const now = new Date();
    const ses = Ses.create();

    log('Script context initialized.');
    return {
        executionId,
        now,
        dynamoClient,
        warehouseClient,
        vendors,
        secretsManagerClient,
        dbClient,
        ses
    };
}

export async function initializeSmallScriptContext(executionId: string) {
    log(`Initializing small script context: executionId=${executionId}.`);

    const secretsManagerClient = new SecretsManagerClient(AWS_CREDENTIALS_CONFIG);

    const warehouseClient = await createWarehousePool(secretsManagerClient);
    const dbClient = await createDbPool(secretsManagerClient);

    const now = new Date();

    log('Script context initialized.');
    return {
        executionId,
        now,
        warehouseClient,
        dbClient
    };
}

export async function finalizeScriptContext(context: ScriptContext) {
    log(`Finalizing script context: executionId=${context.executionId}.`);

    // Add finizaling logic here

    log('Script context finalized.');
}
