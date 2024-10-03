#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import Site from '../lib/stack';
import {env} from '../lib/env';

const app = new cdk.App();
new Site(app, env.AWS_STACK_NAME, {
    env: {account: env.AWS_ACCOUNT_ID, region: env.AWS_REGION}
});
