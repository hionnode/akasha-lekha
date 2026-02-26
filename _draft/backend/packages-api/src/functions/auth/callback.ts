// packages/api/src/functions/auth/callback.ts
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { error, redirect } from '../../lib/response';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const code = event.queryStringParameters?.code;

  if (!code) {
    return error('Missing authorization code', 400);
  }

  // TODO: Implement OAuth token exchange
  // This is the handoff point - I'll implement the full flow

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4321';
  return redirect(`${frontendUrl}/labs/auth/callback?error=not_implemented`);
};
