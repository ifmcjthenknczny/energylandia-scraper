import 'dotenv/config'

import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
    /*
     * Serverside Environment variables, not available on the client.
     * Will throw if you access these variables on the client.
     */
    server: {
        AWS_ACCOUNT_ID: z.string().min(1),
        AWS_REGION: z.string().min(1),
        AWS_STACK_NAME: z.string().min(1),
        DATABASE_NAME: z.string().min(1),
        MONGO_URI: z.string().min(1),
    },

    runtimeEnv: {
        AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
        AWS_REGION: process.env.AWS_REGION,
        AWS_STACK_NAME: process.env.AWS_STACK_NAME,
        DATABASE_NAME: process.env.DATABASE_NAME,
        MONGO_URI: process.env.MONGO_URI,
    },
})
