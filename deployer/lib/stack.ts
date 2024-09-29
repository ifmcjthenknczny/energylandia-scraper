import {aws_certificatemanager as acm, aws_cognito as cognito, aws_ec2 as ec2, aws_ecr as ecr, aws_ecs as ecs, aws_elasticloadbalancingv2 as elbv2, aws_events as events, aws_iam as iam, aws_lambda as lambda, aws_logs as logs, aws_rds as rds, aws_route53 as r53, aws_route53_targets as r53targets, aws_scheduler as scheduler, aws_secretsmanager as secretManager, Duration, RemovalPolicy, Size, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';

const ARCHITECTURE = lambda.Architecture.ARM_64;
const LAMBDA_APP_RESOURCE_NAME = 'LambdaApp';
const NODE_MODULES_RESOURCE_NAME = 'NodeModules';
const RESOURCE_ID = '*';
const RUNTIME = lambda.Runtime.NODEJS_20_X;
const DASHBOARD_URL = 'https://go2metrics.com';
const LOGIN_ROUTE = '/login';

const EVERYDAY_REPORTS = ['AMZ_1', 'AMZ_3', 'GET_MERCHANT_LISTINGS_ALL_DATA', 'GET_MERCHANTS_LISTINGS_FYP_REPORT'];
const ONCE_A_WEEK_REPORTS = ['AMZ_2'];
const EVERYDAY_ADS_REPORTS = ['CAMPAIGN_REPORT_SPONSORED_PRODUCTS', 'CAMPAIGN_REPORT_SPONSORED_BRANDS', 'CAMPAIGN_REPORT_SPONSORED_DISPLAY', 'ADVERTISED_PRODUCT_SPONSORED_PRODUCTS', 'ADVERTISED_PRODUCT_SPONSORED_DISPLAY'];

const SECRET_KEYS = [
    ['AMAZON_LWA_LISTED_APP'],
    ['ADS_CLIENT_ID'],
    ['ADS_CLIENT_SECRET'],
    ['AWS_ACCESS_KEY_ID'],
    ['AWS_REGION'],
    ['AWS_SECRET_ACCESS_KEY'],
    ['COGNITO_CLIENT_ID'],
    ['COGNITO_CLIENT_SECRET'],
    ['COGNITO_USER_POOL_ID'],
    ['DATABASE_URL'],
    ['LWA_APP_ID'],
    ['LWA_CLIENT_SECRET'],
    ['LWA_SOLUTION_ID'],
    ['NEXT_PUBLIC_DEVEXTREME_KEY'],
    ['PDF_BOT_EMAIL'],
    ['PDF_BOT_PASSWORD'],
    ['S3_REPORT_BUCKET'],
    ['WAREHOUSE_HOST'],
    ['WAREHOUSE_NAME'],
    ['WAREHOUSE_PASSWORD'],
    ['WAREHOUSE_USERNAME']
];

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
            memorySize: 1024,
            runtime: RUNTIME,
            timeout: Duration.seconds(900),
            tracing: lambda.Tracing.ACTIVE,
            vpc,
            initialPolicy: [
                new iam.PolicyStatement({
                    actions: ['secretsmanager:GetSecretValue', 'dynamodb:*', 'rds:*', 's3:*', 'ses:*'],
                    effect: iam.Effect.ALLOW,
                    resources: ['*']
                })
            ]
        });

        new logs.LogGroup(this, 'LogGroup', {
            logGroupName: `/aws/lambda/${lambdaApp.functionName}`,
            retention: logs.RetentionDays.TWO_WEEKS
        });

        // COGNITO
        const userpool = new cognito.UserPool(this, 'go2metrics_pool', {
            userPoolName: 'go2metrics_pool',
            signInCaseSensitive: true,
            signInAliases: {
                email: true
            },
            selfSignUpEnabled: true,
            autoVerify: {
                email: true
            },
            userInvitation: {
                // Username has to be provided, in other way there is an error thrown
                emailSubject: 'You have been invited to join Go2Metrics',
                emailBody: `<h2 style="text-align: center;">You're all set to log in to your Go2Metrics account!</h2>
                <br />
                <p>Login with your email ({username}) and temporary password: {####}</p>
                <br />
                <p>Visit <a href="${DASHBOARD_URL}${LOGIN_ROUTE}">go2metrics.com</a>. After your first login, you'll be prompted to change your password for security.</p>
                <br />
                <p>Should you have any questions or need assistance, don't hesitate to reach out to us.</p>
                <br />
                <p style="text-align: right;">Best regards,</p>
                <p style="text-align: right;">The Go2Metrics Team</p>`
            },
            standardAttributes: {
                givenName: {
                    mutable: true,
                    required: true
                },
                familyName: {
                    mutable: true,
                    required: true
                },
                email: {
                    mutable: false,
                    required: true
                },
                profilePicture: {
                    mutable: true,
                    required: false
                }
            },
            customAttributes: {
                'organizationId': new cognito.StringAttribute({
                    mutable: true,
                    minLen: 3,
                    maxLen: 50
                }),
                'role': new cognito.StringAttribute({
                    mutable: true,
                    minLen: 1,
                    maxLen: 2
                }),
                // A = admin, OO = organization owner, OM = organization member
                'isBot': new cognito.BooleanAttribute({
                    mutable: true
                })
            },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: true
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            removalPolicy: RemovalPolicy.RETAIN
        });

        const clientWriteAttributes = (new cognito.ClientAttributes())
            .withStandardAttributes({givenName: true, familyName: true, email: true})
            .withCustomAttributes('organizationId', 'role');

        const clientReadAttributes = (new cognito.ClientAttributes())
            .withStandardAttributes({givenName: true, familyName: true, email: true, emailVerified: true})
            .withCustomAttributes('organizationId', 'role');


        userpool.addClient('go2metrics_cognito_client', {
            generateSecret: true,
            authFlows: {
                userPassword: true
            },
            oAuth: {
                flows: {
                    authorizationCodeGrant: true
                },
                callbackUrls: [
                    DASHBOARD_URL
                ],
                scopes: [
                    cognito.OAuthScope.OPENID
                ]
            },
            authSessionValidity: Duration.minutes(15),
            accessTokenValidity: Duration.days(1),
            idTokenValidity: Duration.minutes(60),
            refreshTokenValidity: Duration.days(60),
            readAttributes: clientReadAttributes,
            writeAttributes: clientWriteAttributes,
            enableTokenRevocation: true
        });


        const loadBalancerSg = new ec2.SecurityGroup(this, 'lb-security-group', {
            vpc,
            allowAllOutbound: true,
            description: 'Security group for the Next.js site load balancer'
        });

        loadBalancerSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
        loadBalancerSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));

        const databaseSg = new ec2.SecurityGroup(this, 'DbSecurityGroup', {
            vpc
        });
        databaseSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432));

        const containerSg = new ec2.SecurityGroup(this, 'container-security-group', {
            vpc,
            allowAllOutbound: true,
            description: 'Security group for the Next.js site'
        });

        containerSg.addIngressRule(containerSg, ec2.Port.allTraffic());
        containerSg.addIngressRule(loadBalancerSg, ec2.Port.allTraffic());
        containerSg.addIngressRule(databaseSg, ec2.Port.allTraffic());

        databaseSg.addIngressRule(containerSg, ec2.Port.allTraffic());

        const repository = ecr.Repository.fromRepositoryName(this, 'repository', props.ecrUrl.split('/').pop() ?? '');

        const appSecrets = secretManager.Secret.fromSecretCompleteArn(this, 'go2metrics_secrets', props.secretArn);
        const dbSecrets = secretManager.Secret.fromSecretCompleteArn(this, 'go2metrics_db_secrets', props.secretArnDb);
        const warehouseSecrets = secretManager.Secret.fromSecretCompleteArn(this, 'go2metrics_warehouse_secrets', props.secretArnWarehouse);

        const taskExecutionRole = new iam.Role(this, 'ecs-task-role', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
        });

        taskExecutionRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                'ecr:GetAuthorizationToken'
            ],
            effect: iam.Effect.ALLOW,
            resources: ['*']
        }));

        taskExecutionRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                'secretsmanager:*'
            ],
            effect: iam.Effect.ALLOW,
            resources: [appSecrets.secretArn, `${appSecrets.secretArn}:*`]
        }));

        const taskDefinition = new ecs.FargateTaskDefinition(this, 'ecs-web-task', {
            cpu: 1024,
            memoryLimitMiB: 2048,
            taskRole: taskExecutionRole,
            executionRole: taskExecutionRole
        });

        taskExecutionRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                'ecr:*'
            ],
            effect: iam.Effect.ALLOW,
            resources: [repository.repositoryArn]
        }));

        taskExecutionRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                'ecr:GetAuthorizationToken'
            ],
            effect: iam.Effect.ALLOW,
            resources: ['*']
        }));

        taskExecutionRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                'secretsmanager:*'
            ],
            effect: iam.Effect.ALLOW,
            resources: [appSecrets.secretArn, `${appSecrets.secretArn}:*`]
        }));

        taskExecutionRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                'ssm:*'
            ],
            effect: iam.Effect.ALLOW,
            resources: ['*']
        }));

        const hostedZone = r53.HostedZone.fromLookup(this, 'zone', {domainName: props.domainName});
        const certificate = acm.Certificate.fromCertificateArn(this, 'certificate', props.certificateArn);

        const containers: { name: string, portMappings: ecs.PortMapping[] | undefined, secrets?: string[][], environment?: { [key: string]: string } }[] = [
            {
                name: 'go2metrics-web',
                portMappings: [{
                    containerPort: 80
                }]
            },
            {
                name: 'go2metrics-client',
                portMappings: [{
                    containerPort: 3000
                }],
                secrets: SECRET_KEYS,
                environment: {
                    'NODE_ENV': 'production'
                }
            }
        ];

        const warehouse = new rds.DatabaseInstance(this, 'go2metrics_warehouse', {
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC
            },
            securityGroups: [databaseSg],
            engine: rds.DatabaseInstanceEngine.postgres({version: rds.PostgresEngineVersion.VER_14}),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.SMALL),
            databaseName: 'go2metrics_warehouse',
            removalPolicy: RemovalPolicy.RETAIN,
            allocatedStorage: 100,
            credentials: rds.Credentials.fromSecret(warehouseSecrets),
            publiclyAccessible: true,
            backupRetention: Duration.days(7)
        });

        warehouse.connections.allowFrom(containerSg, ec2.Port.tcp(5432));
        taskDefinition.node.addDependency(warehouse);

        const database = new rds.DatabaseInstance(this, 'go2metrics_db', {
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC
            },
            securityGroups: [databaseSg],
            engine: rds.DatabaseInstanceEngine.postgres({version: rds.PostgresEngineVersion.VER_14}),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
            databaseName: 'go2metrics_db',
            removalPolicy: RemovalPolicy.RETAIN,
            allocatedStorage: 20,
            credentials: rds.Credentials.fromSecret(dbSecrets),
            publiclyAccessible: true,
            backupRetention: Duration.days(7)
        });

        database.connections.allowFrom(containerSg, ec2.Port.tcp(5432));
        taskDefinition.node.addDependency(database);

        for (const imageProps of containers) {
            const imageUri = repository.repositoryUriForTag(`${imageProps.name}-${props.buildId}`);

            taskDefinition.addContainer(`${imageProps.name}-container`, {
                image: ecs.ContainerImage.fromRegistry(imageUri),
                portMappings: imageProps.portMappings,
                logging: ecs.LogDrivers.awsLogs({
                    logRetention: logs.RetentionDays.TWO_WEEKS,
                    streamPrefix: props.domainName
                }),
                secrets: Object.fromEntries(imageProps.secrets?.map(([secretKey, envKey]) => [envKey ?? secretKey, ecs.Secret.fromSecretsManager(appSecrets, secretKey)]) ?? []),
                environment: imageProps.environment
            });
        }

        const cluster = new ecs.Cluster(this, 'cluster', {
            containerInsights: true,
            clusterName: `${name}-cluster`,
            vpc
        });

        const service = new ecs.FargateService(this, 'service', {
            cluster,
            taskDefinition,
            enableExecuteCommand: true,
            desiredCount: 1,
            healthCheckGracePeriod: Duration.seconds(600),
            securityGroups: [containerSg],
            assignPublicIp: true
        });

        const lb = new elbv2.ApplicationLoadBalancer(this, 'loadbalancer', {
            vpc,
            internetFacing: true,
            securityGroup: loadBalancerSg
        });

        lb.addRedirect({
            sourceProtocol: elbv2.ApplicationProtocol.HTTP,
            sourcePort: 80,
            targetProtocol: elbv2.ApplicationProtocol.HTTPS,
            targetPort: 443
        });

        const httpsListener = lb.addListener('https-listener', {
            port: 443,
            open: true,
            certificates: [certificate]
        });

        httpsListener.addTargets('web-target', {
            port: 80,
            targets: [service],
            protocol: elbv2.ApplicationProtocol.HTTP,
            healthCheck: {
                path: '/ecs-health',
                interval: Duration.seconds(180),
                healthyHttpCodes: '200-499',
                healthyThresholdCount: 3,
                unhealthyThresholdCount: 3,
                timeout: Duration.seconds(50)
            }
        });

        new r53.ARecord(this, 'alias-record', {
            zone: hostedZone,
            recordName: props.domainName,
            target: r53.RecordTarget.fromAlias(new r53targets.LoadBalancerTarget(lb))
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

        // Request enqueued SP API reports
        new scheduler.CfnSchedule(this, 'SPAPI_REQUEST_15M', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // every 15 minutes
            scheduleExpression: events.Schedule.rate(Duration.minutes(15)).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'REQUEST_SPAPI'}),
                roleArn: schedulerRole.roleArn
            }
        });

        // Download reports from SP API
        new scheduler.CfnSchedule(this, 'SPAPI_DOWNLOAD_15M', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // every 15 minutes
            scheduleExpression: events.Schedule.rate(Duration.minutes(15)).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'DOWNLOAD_SPAPI'}),
                roleArn: schedulerRole.roleArn
            }
        });

        // Request enqueued Ads API reports
        new scheduler.CfnSchedule(this, 'ADSAPI_REQUEST_15M', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // every 15 minutes
            scheduleExpression: events.Schedule.rate(Duration.minutes(15)).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'REQUEST_ADSAPI'}),
                roleArn: schedulerRole.roleArn
            }
        });

        // Download reports from Ads API
        new scheduler.CfnSchedule(this, 'ADSAPI_DOWNLOAD_15M', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // every 15 minutes
            scheduleExpression: events.Schedule.rate(Duration.minutes(15)).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'DOWNLOAD_ADSAPI'}),
                roleArn: schedulerRole.roleArn
            }
        });

        // Process from S3 (both SP and Ads API)
        new scheduler.CfnSchedule(this, 'PROCESS_15M', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // every 15 minutes
            scheduleExpression: events.Schedule.rate(Duration.minutes(15)).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'PROCESS'}),
                roleArn: schedulerRole.roleArn
            }
        });

        // Update buybox
        new scheduler.CfnSchedule(this, 'UPDATE_BUYBOX_15M', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // every 15 minutes
            scheduleExpression: events.Schedule.rate(Duration.minutes(15)).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'UPDATE_BUYBOX'}),
                roleArn: schedulerRole.roleArn
            }
        });

        // Enqueue reports
        new scheduler.CfnSchedule(this, 'SPAPI_ENQUEUE_ONCE_A_WEEK', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // 5:30am Warsaw Time in UTC on Mondays
            scheduleExpression: events.Schedule.cron({minute: '30', hour: '1', weekDay: 'MON'}).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'ENQUEUE_SPAPI', reportTypes: ONCE_A_WEEK_REPORTS}),
                roleArn: schedulerRole.roleArn
            }
        });

        // Check for new settlements reports
        new scheduler.CfnSchedule(this, 'SPAPI_ENQUEUE_EVERYDAY_SETTLEMENTS', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // 1:30am Warsaw Time in UTC daily
            scheduleExpression: events.Schedule.cron({minute: '30', hour: '1'}).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'ENQUEUE_SETTLEMENTS'}),
                roleArn: schedulerRole.roleArn
            }
        });

        new scheduler.CfnSchedule(this, 'SPAPI_ENQUEUE_EVERYDAY', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // 1:30am Warsaw Time in UTC daily
            scheduleExpression: events.Schedule.cron({minute: '30', hour: '1'}).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'ENQUEUE_SPAPI', reportTypes: EVERYDAY_REPORTS}),
                roleArn: schedulerRole.roleArn
            }
        });

        new scheduler.CfnSchedule(this, 'SPAPI_ENQUEUE_AMZ_1', {
            flexibleTimeWindow: {
                mode: 'FLEXIBLE',
                maximumWindowInMinutes: 30
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            scheduleExpression: events.Schedule.rate(Duration.hours(2)).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'ENQUEUE_SPAPI', reportTypes: ['AMZ_1'], dayOffset: 5}),
                roleArn: schedulerRole.roleArn
            }
        });

        new scheduler.CfnSchedule(this, 'ADSAPI_ENQUEUE_EVERYDAY', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // 1:30am Warsaw Time in UTC daily
            scheduleExpression: events.Schedule.cron({minute: '30', hour: '1'}).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'ENQUEUE_ADSAPI', reportTypes: EVERYDAY_ADS_REPORTS}),
                roleArn: schedulerRole.roleArn
            }
        });

        new scheduler.CfnSchedule(this, 'UPDATE_PRODUCTS_1', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // 8:00am Warsaw Time in UTC daily
            scheduleExpression: events.Schedule.cron({minute: '0', hour: '8'}).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'UPDATE_PRODUCTS'}),
                roleArn: schedulerRole.roleArn
            }
        });

        new scheduler.CfnSchedule(this, 'UPDATE_PRODUCTS_2', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // 4:00pm Warsaw Time in UTC daily
            scheduleExpression: events.Schedule.cron({minute: '0', hour: '16'}).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'UPDATE_PRODUCTS'}),
                roleArn: schedulerRole.roleArn
            }
        });

        new scheduler.CfnSchedule(this, 'EXCHANGE_RATES', {
            flexibleTimeWindow: {
                mode: 'FLEXIBLE',
                maximumWindowInMinutes: 15
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            // 4:30pm Warsaw Time
            scheduleExpression: events.Schedule.cron({minute: '30', hour: '16'}).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'CURRENCIES'}),
                roleArn: schedulerRole.roleArn
            }
        });

        new scheduler.CfnSchedule(this, 'SEND_REPORTS_BY_EMAIL', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            scheduleExpression: events.Schedule.rate(Duration.minutes(15)).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'SEND_REPORTS_BY_EMAIL'}),
                roleArn: schedulerRole.roleArn
            }
        });

        new scheduler.CfnSchedule(this, 'FILL_SELLER_NAMES', {
            flexibleTimeWindow: {
                mode: 'OFF'
            },
            scheduleExpressionTimezone: 'Europe/Warsaw',
            scheduleExpression: events.Schedule.cron({minute: '00', hour: '5'}).expressionString,
            target: {
                arn: lambdaApp.functionArn,
                input: JSON.stringify({action: 'FILL_SELLER_NAMES'}),
                roleArn: schedulerRole.roleArn
            }
        });

        // DynamoDB
        // for (const tableName of DYNAMODB_TABLES) {
        //     new dynamodb.Table(this, tableName, {
        //         partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
        //         tableName,
        //         removalPolicy: RemovalPolicy.RETAIN
        //     });
        // }
    }
}

export default Site;
