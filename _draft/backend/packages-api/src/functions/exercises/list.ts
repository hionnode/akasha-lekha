// packages/api/src/functions/exercises/list.ts
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { json } from '../../lib/response';

export const handler: APIGatewayProxyHandlerV2 = async () => {
  // TODO: Return exercises from database or static content
  return json({ exercises: [] });
};
