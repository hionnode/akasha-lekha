// packages/api/src/functions/auth/logout.ts
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { json } from "../../lib/response";

export const handler: APIGatewayProxyHandlerV2 = async () => {
  // TODO: Implement logout
  return json({ success: true });
};
