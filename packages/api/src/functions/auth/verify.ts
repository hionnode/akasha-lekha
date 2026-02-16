// packages/api/src/functions/auth/verify.ts
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { error } from '../../lib/response';

export const handler: APIGatewayProxyHandlerV2 = async (_event) => {
  // TODO: Implement token verification
  return error('Not implemented', 501);
};
