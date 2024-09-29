import {z} from 'zod';

import {createEnv} from '@t3-oss/env-core';

import 'dotenv/config';

export const env = createEnv({
    /*
     * Serverside Environment variables, not available on the client.
     * Will throw if you access these variables on the client.
     */
    server: {
        AMAZON_LWA_LISTED_APP: z.string().min(1),
        ADS_CLIENT_ID: z.string().min(1),
        ADS_CLIENT_SECRET: z.string().min(1),
        AWS_REGION: z.string().min(1),
        AWS_ACCOUNT_ID: z.string().min(1),
        AWS_SECRET_ARN: z.string().min(1),
        AWS_SECRET_ARN_DB: z.string().min(1),
        AWS_SECRET_ARN_WAREHOUSE: z.string().min(1),
        AWS_STACK_NAME: z.string().min(1),
        AWS_DOMAIN_NAME: z.string().min(1),
        AWS_CERTIFICATE_ARN: z.string().min(1),
        AWS_ECR_URL: z.string().min(1),
        BUILD_ID: z.string().min(1),
        NEXT_PUBLIC_DEVEXTREME_KEY: z.string().min(1),
        DATABASE_URL: z.string().min(1),
        LWA_APP_ID: z.string().min(1),
        LWA_CLIENT_SECRET: z.string().min(1),
        LWA_SOLUTION_ID: z.string().min(1),
        PDF_BOT_EMAIL: z.string().min(1),
        PDF_BOT_PASSWORD: z.string().min(1),
        S3_REPORT_BUCKET: z.string().min(1),
        WAREHOUSE_HOST: z.string().min(1),
        WAREHOUSE_NAME: z.string().min(1),
        WAREHOUSE_PASSWORD: z.string().min(1),
        WAREHOUSE_USERNAME: z.string().min(1)
    },

    runtimeEnv: {
        AMAZON_LWA_LISTED_APP: process.env.AMAZON_LWA_LISTED_APP,
        ADS_CLIENT_ID: process.env.ADS_CLIENT_ID,
        ADS_CLIENT_SECRET: process.env.ADS_CLIENT_SECRET,
        AWS_REGION: process.env.AWS_REGION,
        AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
        AWS_SECRET_ARN: process.env.AWS_SECRET_ARN,
        AWS_SECRET_ARN_DB: process.env.AWS_SECRET_ARN_DB,
        AWS_SECRET_ARN_WAREHOUSE: process.env.AWS_SECRET_ARN_WAREHOUSE,
        AWS_STACK_NAME: process.env.AWS_STACK_NAME,
        AWS_DOMAIN_NAME: process.env.AWS_DOMAIN_NAME,
        AWS_CERTIFICATE_ARN: process.env.AWS_CERTIFICATE_ARN,
        AWS_ECR_URL: process.env.AWS_ECR_URL,
        BUILD_ID: process.env.BUILD_ID,
        DATABASE_URL: process.env.DATABASE_URL,
        NEXT_PUBLIC_DEVEXTREME_KEY: process.env.NEXT_PUBLIC_DEVEXTREME_KEY,
        LWA_APP_ID: process.env.LWA_APP_ID,
        LWA_CLIENT_SECRET: process.env.LWA_CLIENT_SECRET,
        LWA_SOLUTION_ID: process.env.LWA_SOLUTION_ID,
        PDF_BOT_EMAIL: process.env.PDF_BOT_EMAIL,
        PDF_BOT_PASSWORD: process.env.PDF_BOT_PASSWORD,
        S3_REPORT_BUCKET: process.env.S3_REPORT_BUCKET,
        WAREHOUSE_HOST: process.env.WAREHOUSE_HOST,
        WAREHOUSE_NAME: process.env.WAREHOUSE_NAME,
        WAREHOUSE_PASSWORD: process.env.WAREHOUSE_PASSWORD,
        WAREHOUSE_USERNAME: process.env.WAREHOUSE_USERNAME
    }
});
