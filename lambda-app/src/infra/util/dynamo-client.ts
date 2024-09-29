import {DynamoDBClient, ScanCommand, ScanCommandInput} from '@aws-sdk/client-dynamodb';
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand
} from '@aws-sdk/lib-dynamodb';

import {AWS_CREDENTIALS_CONFIG} from './config';

function unwrap(item: Record<string, any>): Record<string, string> {
    const entries = Object.keys(item).map(key => {
        if (typeof item[key]['BOOL'] !== 'undefined') {
            return [key, item[key]['BOOL']];
        }

        return [key, item[key]['S']];
    });

    return Object.fromEntries(entries);
}

export class DynamoClient {
    private readonly dynamo: DynamoDBDocumentClient;

    private constructor(dynamo: DynamoDBDocumentClient) {
        this.dynamo = dynamo;
    }

    static create() {
        const client = new DynamoDBClient(
            AWS_CREDENTIALS_CONFIG
        );
        const dynamo = DynamoDBDocumentClient.from(client);
        return new DynamoClient(dynamo);
    }

    async save<ItemType extends object = Record<string, any>>(
        table: string,
        item: ItemType
    ) {
        const command = new PutCommand({
            TableName: table,
            Item: item
        });
        await this.dynamo.send(command);
    }

    async delete(table: string, id: string) {
        const command = new DeleteCommand({
            TableName: table,
            Key: {id}
        });
        await this.dynamo.send(command);
    }

    async findAll<T>(table: string, options: Partial<ScanCommandInput> = {}): Promise<T[]> {
        const command = new ScanCommand({TableName: table, ...options});
        return this.dynamo.send(command).then(it => it.Items!.map(unwrap) as T[]);
    }

    async find<T>(table: string, id: string): Promise<T | undefined> {
        const command = new GetCommand({
            TableName: table,
            Key: {id}
        });

        return this.dynamo.send(command).then(it => it.Item as T | undefined);
    }
}
