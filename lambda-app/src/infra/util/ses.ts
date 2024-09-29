import {SendEmailCommand, SESClient} from '@aws-sdk/client-ses';

import {AWS_REGION} from './config';

interface SendEmailParams {
    fromAddress?: string;
    toAddresses: string[];
    subject: string;
    body: string;
}

// TODO: move it to other lambda?

export class Ses {
    private readonly sesClient: SESClient;

    private constructor(ses: SESClient) {
        this.sesClient = ses;
    }

    static create() {
        const client = new SESClient({
            region: process.env.ENVIRONMENT === 'local' ? undefined : AWS_REGION,
            endpoint: process.env.ENVIRONMENT === 'local' ? 'http://localhost:8420' : undefined
        });
        return new Ses(client);
    }

    async sendEmail(params: SendEmailParams) {
        return this.sesClient.send(new SendEmailCommand({
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: params.body
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: params.subject
                }
            },
            Source: params.fromAddress,
            Destination: {
                ToAddresses: params.toAddresses
            }
        }));
    }
}
