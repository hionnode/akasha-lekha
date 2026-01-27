// packages/api/src/lib/db.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const isLocal = process.env.DYNAMODB_ENDPOINT !== undefined;

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  ...(isLocal && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: "local",
      secretAccessKey: "local",
    },
  }),
});

export const db = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export { GetCommand, PutCommand, QueryCommand, DeleteCommand };
