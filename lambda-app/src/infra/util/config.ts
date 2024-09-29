import dotenv from 'dotenv';

import {fromIni} from '@aws-sdk/credential-providers';

dotenv.config();

export const ENVIRONMENT = process.env.ENVIRONMENT;
export const DEBUG = process.env.DEBUG === 'true';
export const AWS_PROFILE = process.env.AWS_PROFILE;
export const AWS_REGION = 'eu-central-1';
export const SITE_SECRETS_NAME = 'go2metrics_secrets';
export const SELLERS_SECRETS_NAME = 'go2metrics_sellers_tokens';
export const WAREHOUSE_SECRETS_NAME = 'go2metrics_warehouse_secrets';
export const DATABASE_SECRETS_NAME = 'go2metrics_db_secrets';

export const AWS_CREDENTIALS_CONFIG = {
    region: AWS_REGION,
    credentials: AWS_PROFILE ? fromIni({profile: AWS_PROFILE}) : undefined
};
