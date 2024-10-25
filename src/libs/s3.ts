'use server'

import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;

const S3 = new S3Client({
    region: "us-east-1",
    endpoint: R2_ENDPOINT as string,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID as string,
        secretAccessKey: R2_SECRET_ACCESS_KEY as string,
    },
});

export async function uploadFile(file: File | Buffer | string, fileType: string, fileName: string) {
    const params = {
        Bucket: R2_BUCKET_NAME as string,
        Key: fileName,
        Body: file,
        ContentType: fileType,
    };

    return S3.send(new PutObjectCommand(params));
}