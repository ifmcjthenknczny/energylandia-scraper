#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import {env} from '../lib/env';
import Site from '../lib/stack';

import 'source-map-support/register';

const app = new cdk.App();
new Site(app, env.AWS_STACK_NAME, {
    env: {account: env.AWS_ACCOUNT_ID, region: env.AWS_REGION}
}, {secretArn: env.AWS_SECRET_ARN, domainName: env.AWS_DOMAIN_NAME, certificateArn: env.AWS_CERTIFICATE_ARN, ecrUrl: env.AWS_ECR_URL, buildId: env.BUILD_ID, secretArnDb: env.AWS_SECRET_ARN_DB, secretArnWarehouse: env.AWS_SECRET_ARN_WAREHOUSE});
