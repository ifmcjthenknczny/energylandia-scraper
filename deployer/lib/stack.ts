import {
    Duration,
    RemovalPolicy,
    Size,
    Stack,
    StackProps,
    aws_events as events,
    aws_iam as iam,
    aws_lambda as lambda,
    aws_logs as logs,
    aws_scheduler as scheduler,
} from 'aws-cdk-lib'

import { Construct } from 'constructs'
import { env } from './env'

const ARCHITECTURE = lambda.Architecture.ARM_64
const LAMBDA_APP_RESOURCE_NAME = 'LambdaApp'
const NODE_MODULES_RESOURCE_NAME = 'NodeModules'
const RESOURCE_ID = '*'
const RUNTIME = lambda.Runtime.NODEJS_22_X

class Site extends Stack {
    constructor(scope: Construct, name: string, stackProps: StackProps) {
        super(scope, name, stackProps)

        // LAMBDA
        const nodeModules = new lambda.LayerVersion(
            this,
            NODE_MODULES_RESOURCE_NAME,
            {
                code: lambda.Code.fromAsset(NODE_MODULES_RESOURCE_NAME),
                description: `Stack ${this.stackName} Layer ${NODE_MODULES_RESOURCE_NAME}`,
                removalPolicy: RemovalPolicy.DESTROY,
            },
        )

        const lambdaApp = new lambda.Function(this, LAMBDA_APP_RESOURCE_NAME, {
            architecture: ARCHITECTURE,
            code: lambda.Code.fromAsset(LAMBDA_APP_RESOURCE_NAME),
            description: `Stack ${this.stackName} Function ${LAMBDA_APP_RESOURCE_NAME}`,
            ephemeralStorageSize: Size.mebibytes(512),
            handler: 'lambda-starter.handler',
            layers: [nodeModules],
            memorySize: 128,
            runtime: RUNTIME,
            timeout: Duration.seconds(60),
            tracing: lambda.Tracing.ACTIVE,
            retryAttempts: 2,
            environment: {
                DATABASE_NAME: env.DATABASE_NAME,
                MONGO_URI: env.MONGO_URI,
            },
        })

        new logs.LogGroup(this, 'LogGroup', {
            logGroupName: `/aws/lambda/${lambdaApp.functionName}`,
            retention: logs.RetentionDays.TWO_WEEKS,
        })

        // SCHEDULERS
        const schedulerRole = new iam.Role(this, 'SchedulerRole', {
            assumedBy: new iam.ServicePrincipal(`scheduler.${this.urlSuffix}`),
        })

        schedulerRole.assumeRolePolicy?.addStatements(
            new iam.PolicyStatement({
                actions: ['sts:AssumeRole'],
                conditions: {
                    ArnLike: {
                        'aws:SourceArn': `arn:${this.partition}:scheduler:${this.region}:${this.account}:schedule/*/${this.stackName}-${RESOURCE_ID}-*`,
                    },
                },
                effect: iam.Effect.ALLOW,
                principals: [
                    new iam.ServicePrincipal(`scheduler.${this.urlSuffix}`),
                ],
            }),
        )

        schedulerRole.addToPolicy(
            new iam.PolicyStatement({
                actions: ['lambda:InvokeFunction'],
                effect: iam.Effect.ALLOW,
                resources: [lambdaApp.functionArn],
                sid: 'StartExecutionPolicy',
            }),
        )

        new scheduler.CfnSchedule(this, 'SCRAPE_WAITING_TIMES', {
            flexibleTimeWindow: {
                mode: 'OFF',
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            scheduleExpression: events.Schedule.rate(Duration.minutes(15))
                .expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({ action: 'SCRAPE_WAITING_TIMES' }),
                roleArn: schedulerRole.roleArn,
            },
        })

        new scheduler.CfnSchedule(this, 'SCRAPE_OPENING_HOURS', {
            flexibleTimeWindow: {
                mode: 'FLEXIBLE',
                maximumWindowInMinutes: 30,
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            scheduleExpression: events.Schedule.cron({ minute: '0', hour: '4' })
                .expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({ action: 'SCRAPE_OPENING_HOURS' }),
                roleArn: schedulerRole.roleArn,
            },
        })
    }
}

export default Site
