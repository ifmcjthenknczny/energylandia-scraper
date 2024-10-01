/* eslint-disable */

const app = require('./lambda-app');

function getOtherEventAction(event) {
    if (event.Records && event.Records[0].cf) {
        return 'CLOUDFRONT';
    }
    if (event.configRuleId && event.configRuleName && event.configRuleArn) {
        return 'AWS_CONFIG';
    }
    if (event.Records && (event.Records[0].eventSource === 'aws:codecommit')) {
        return 'CODE_COMMIT';
    }
    if (event.authorizationToken === 'incoming-client-token') {
        return 'API_GATEWAY_AUTHORIZER';
    }
    if (event.StackId && event.RequestType && event.ResourceType) {
        return 'CLOUD_FORMATION';
    }
    if (event.Records && (event.Records[0].eventSource === 'aws:ses')) {
        return 'SES';
    }
    if (event.pathParameters && event.pathParameters.proxy) {
        return 'API_GATEWAY_AWS_PROXY';
    }
    if (event.source === 'aws.events') {
        return 'SCHEDULED_EVENT';
    }
    if (event.awslogs && event.awslogs.data) {
        return 'CLOUD_WATCH_LOGS';
    }
    if (event.Records && (event.Records[0].EventSource === 'aws:sns')) {
        return 'SNS';
    }
    if (event.Records && (event.Records[0].eventSource === 'aws:dynamodb')) {
        return 'DYNAMO_DB';
    }
    if (event.records && event.records[0].approximateArrivalTimestamp || event.records && event.deliveryStreamArn && event.deliveryStreamArn.startsWith('arn:aws:kinesis:')) {
        return 'KINESIS_FIREHOSE';
    }
    if (event.eventType === 'SyncTrigger' && event.identityId && event.identityPoolId) {
        return 'COGNITO_SYNC_TRIGGER';
    }
    if (event.Records && event.Records[0].eventSource === 'aws:kinesis') {
        return 'KINESIS';
    }
    if (event.Records && event.Records[0].eventSource === 'aws:s3') {
        return 'S3';
    }
    if (event.operation && event.message) {
        return 'MOBILE_BACKEND';
    }
    if (event.requestContext.http) {
        return 'HTTP';
    }

    return 'unknown';
}

exports.handler = async(event, context) => {
    const action = event.action ?? getOtherEventAction(event);
    const config = {
        action: action,
        executionId: context.awsRequestId,
        rawEvent: event,
        runningLocal: false
    };
    const result = await app.lambda(config);
    return result;
};
