import { AWS_CREDENTIALS_CONFIG, SECRETS_NAME } from "./config";
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { Upload } from "@aws-sdk/lib-storage";
import { promises as fs } from "fs";
import { getSecretsFromAws } from "./secrets";
import { log } from "./log";
import path from "path";

export async function uploadFile(location: string, content: Buffer) {
  const secretManagerClient = new SecretsManagerClient(AWS_CREDENTIALS_CONFIG);

  const secrets = await getSecretsFromAws(SECRETS_NAME, secretManagerClient);

  const S3_BUCKET = secrets.S3_BUCKET || process.env.S3_BUCKET;

  if (S3_BUCKET) {
    // Staging and production use
    const s3Client = new S3Client({ region: process.env.AWS_REGION });
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: S3_BUCKET,
        Key: location,
        Body: content,
      },
    });
    await upload.done();
    return location;
  } else if (process.env.TEMP_PATH) {
    // Development use only
    log("S3_BUCKET not set, saving to local filesystem");
    const localFilePath = path.join(process.env.TEMP_PATH, location);
    await fs.writeFile(localFilePath, content);
    return `file://${localFilePath}`;
  } else {
    throw new Error("S3_BUCKET not set, and TEMP_PATH not set");
  }
}

export async function deleteFile(locations: string[]) {
  const secretManagerClient = new SecretsManagerClient(AWS_CREDENTIALS_CONFIG);

  const secrets = await getSecretsFromAws(SECRETS_NAME, secretManagerClient);

  const S3_BUCKET = secrets.S3_BUCKET || process.env.S3_BUCKET;

  if (S3_BUCKET) {
    // Staging and production use
    const keys = locations.map((location) => {
      return { Key: location };
    });

    const s3Client = new S3Client({ region: process.env.AWS_REGION });
    const command = new DeleteObjectsCommand({
      Bucket: S3_BUCKET,
      Delete: {
        Objects: keys,
      },
    });

    try {
      const { Deleted } = await s3Client.send(command);
      log(
        `Successfully deleted ${Deleted?.length ?? 0} objects from S3 bucket.`,
      );
    } catch (err) {
      console.error(err);
    }
  } else if (process.env.TEMP_PATH) {
    // Development use only
    log("S3_BUCKET not set, deleting from local filesystem");
    for (const location of locations) {
      const filePath = location.replace("file://", "");
      await fs.rm(
        filePath.startsWith("/")
          ? filePath
          : path.join(process.env.TEMP_PATH, filePath),
      );
    }
  } else {
    throw new Error("S3_BUCKET not set, and TEMP_PATH not set");
  }
}

export async function downloadFile(location: string) {
  const secretManagerClient = new SecretsManagerClient(AWS_CREDENTIALS_CONFIG);

  const secrets = await getSecretsFromAws(SECRETS_NAME, secretManagerClient);

  const S3_BUCKET = secrets.S3_BUCKET || process.env.S3_BUCKET;

  if (S3_BUCKET) {
    // Staging and production use
    const s3Client = new S3Client({ region: process.env.AWS_REGION });
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: location,
    });
    const response = await s3Client.send(command);
    return response.Body
      ? Buffer.from(await response.Body.transformToByteArray())
      : undefined;
  } else if (process.env.TEMP_PATH) {
    // Development use only
    log("S3_BUCKET not set, downloading from local filesystem");
    const filePath = location.replace("file://", "");
    return fs.readFile(
      filePath.startsWith("/")
        ? filePath
        : path.join(process.env.TEMP_PATH, filePath),
    );
  } else {
    throw new Error("S3_BUCKET not set, and TEMP_PATH not set");
  }
}
