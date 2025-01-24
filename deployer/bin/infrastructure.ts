#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib'

import Site from '../lib/stack.js'
import { env } from '../lib/env.js'

const app = new cdk.App()
new Site(app, env.AWS_STACK_NAME, {
    env: { account: env.AWS_ACCOUNT_ID, region: env.AWS_REGION },
})
