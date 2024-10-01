import dotenv from 'dotenv';
import {fromIni} from '@aws-sdk/credential-providers';

dotenv.config();

export const ENVIRONMENT = process.env.ENVIRONMENT;
export const DEBUG = process.env.DEBUG === 'true';
export const AWS_PROFILE = process.env.AWS_PROFILE;
export const AWS_REGION = 'eu-central-1';
export const SECRETS_NAME = 'EL_secrets';

export const AWS_CREDENTIALS_CONFIG = {
    region: AWS_REGION,
    credentials: AWS_PROFILE ? fromIni({profile: AWS_PROFILE}) : undefined
};
