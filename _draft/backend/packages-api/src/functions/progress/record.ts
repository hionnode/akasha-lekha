// packages/api/src/functions/progress/record.ts
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { error } from '../../lib/response';

export const handler: APIGatewayProxyHandlerV2 = async () => {
  // TODO: Implement with auth
  return error('Unauthorized', 401);
};
