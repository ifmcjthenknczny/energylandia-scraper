import {
    GetSecretValueCommand,
    SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'

export async function getSecretsFromAws(
    secretId: string,
    secretsManagerClient: SecretsManagerClient,
): Promise<Record<string, string>> {
    const response = await secretsManagerClient.send(
        new GetSecretValueCommand({
            SecretId: secretId,
        }),
    )

    return JSON.parse(response?.SecretString || '{}')
}
