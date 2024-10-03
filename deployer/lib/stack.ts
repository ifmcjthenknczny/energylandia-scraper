import {Duration, RemovalPolicy, Size, Stack, StackProps, aws_certificatemanager as acm, aws_cognito as cognito, aws_ec2 as ec2, aws_ecr as ecr, aws_ecs as ecs, aws_elasticloadbalancingv2 as elbv2, aws_events as events, aws_iam as iam, aws_lambda as lambda, aws_logs as logs, aws_route53 as r53, aws_route53_targets as r53targets, aws_rds as rds, aws_scheduler as scheduler, aws_secretsmanager as secretManager} from 'aws-cdk-lib';

import { Construct } from 'constructs';

const ARCHITECTURE = lambda.Architecture.ARM_64;
const LAMBDA_APP_RESOURCE_NAME = 'LambdaApp';
const NODE_MODULES_RESOURCE_NAME = 'NodeModules';
const RESOURCE_ID = '*';
const RUNTIME = lambda.Runtime.NODEJS_20_X;

type NextjsSiteProps = {
    secretArn: string;
    domainName: string;
    certificateArn: string;
    ecrUrl: string;
    buildId: string;
    secretArnDb: string;
    secretArnWarehouse: string;
}

class Site extends Stack {
    constructor(scope: Construct, name: string, stackProps: StackProps, props: NextjsSiteProps) {
        super(scope, name, stackProps);

        // VPC
        const vpc = new ec2.Vpc(this, 'VPC', {
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED
                },
                {
                    cidrMask: 24,
                    name: 'PrivateWithEgress',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
                },
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC
                }
            ]
        });

        // LAMBDA
        const nodeModules = new lambda.LayerVersion(this, NODE_MODULES_RESOURCE_NAME, {
            code: lambda.Code.fromAsset(NODE_MODULES_RESOURCE_NAME),
            description: `Stack ${this.stackName} Layer ${NODE_MODULES_RESOURCE_NAME}`,
            removalPolicy: RemovalPolicy.DESTROY
        });

        const lambdaApp = new lambda.Function(this, LAMBDA_APP_RESOURCE_NAME, {
            architecture: ARCHITECTURE,
            code: lambda.Code.fromAsset(LAMBDA_APP_RESOURCE_NAME),
            description: `Stack ${this.stackName} Function ${LAMBDA_APP_RESOURCE_NAME}`,
            ephemeralStorageSize: Size.mebibytes(512),
            handler: 'lambda-starter.handler',
            layers: [nodeModules],
            memorySize: 128,
            runtime: RUNTIME,
            timeout: Duration.seconds(120),
            tracing: lambda.Tracing.ACTIVE,
            vpc,
            initialPolicy: [
                new iam.PolicyStatement({
                    actions: ['secretsmanager:GetSecretValue'],
                    effect: iam.Effect.ALLOW,
                    resources: ['*']
                })
            ]
        });

        new logs.LogGroup(this, 'LogGroup', {
            logGroupName: `/aws/lambda/${lambdaApp.functionName}`,
            retention: logs.RetentionDays.TWO_WEEKS
        });

        // SCHEDULERS
        const schedulerRole = new iam.Role(this, 'SchedulerRole', {
            assumedBy: new iam.ServicePrincipal(`scheduler.${this.urlSuffix}`)
        });

        schedulerRole.assumeRolePolicy?.addStatements(
            new iam.PolicyStatement({
                actions: ['sts:AssumeRole'],
                conditions: {
                    ArnLike: {
                        'aws:SourceArn': `arn:${this.partition}:scheduler:${this.region}:${this.account}:schedule/*/${this.stackName}-${RESOURCE_ID}-*`
                    }
                },
                effect: iam.Effect.ALLOW,
                principals: [new iam.ServicePrincipal(`scheduler.${this.urlSuffix}`)]
            })
        );

        schedulerRole.addToPolicy(new iam.PolicyStatement({
            actions: ['lambda:InvokeFunction'],
            effect: iam.Effect.ALLOW,
            resources: [lambdaApp.functionArn],
            sid: 'StartExecutionPolicy'
        }));

        new scheduler.CfnSchedule(this, 'SCRAPE_WAITING_TIMES', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            scheduleExpression: events.Schedule.cron({
                minute: '0/5',
                hour: '10-20',
            }).expressionString + ',? *,*',
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'SCRAPE_WAITING_TIMES'}),
                roleArn: schedulerRole.roleArn
            }
        });
    }
}

export default Site;
