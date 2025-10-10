import { randomUUID } from "crypto";
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} from "../config/env";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { Express } from "express";

interface S3Service {
    upload(input: { buffer: Buffer; filename: string; mimetype: string }): Promise<string | null>;
    delete(url: string): Promise<void>;
  }  

export class S3ServiceImpl implements S3Service {
  private client: S3Client;
  private region: string;
  private awsPublicKey: string;
  private awsSecretKey: string;
  private bucketName: string;

  constructor() {
    this.region = AWS_REGION;
    this.awsPublicKey = AWS_ACCESS_KEY_ID;
    this.awsSecretKey = AWS_SECRET_ACCESS_KEY;
    this.bucketName = AWS_BUCKET_NAME;

    if (!this.region) throw new Error("AWS region is undefined");
    if (!this.awsPublicKey) throw new Error("AWS access key is undefined");
    if (!this.awsSecretKey) throw new Error("AWS secret key is undefined");
    if (!this.bucketName) throw new Error("AWS bucket name is undefined");

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.awsPublicKey,
        secretAccessKey: this.awsSecretKey,
      },
    });
  }

  async upload(input: { buffer: Buffer; filename: string; mimetype: string }): Promise<string | null> {
    const fileKey = randomUUID() + "-" + input.filename;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: input.buffer,
      ContentType: input.mimetype,
      ACL: "public-read",
    });
  
    try {
      await this.client.send(command);
      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;
      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  }
  

  async delete(url: string): Promise<void> {
    if (!this.isS3BucketUrl(url)) {
      console.error("URL does not point to an S3 object.");
      return;
    }

    const key = this.getS3ObjectKey(url);
    if (!key) {
      console.error("Could not extract object key from URL.");
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.client.send(command);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  private isS3BucketUrl(url: string): boolean {
    try {
      const { hostname } = new URL(url);
      return hostname.endsWith(`s3.${this.region}.amazonaws.com`);
    } catch {
      return false;
    }
  }

  private getS3ObjectKey(url: string): string | null {
    try {
      const { pathname } = new URL(url);
      return pathname.slice(1);
    } catch {
      return null;
    }
  }
}
