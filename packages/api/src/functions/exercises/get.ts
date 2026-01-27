// packages/api/src/functions/exercises/get.ts
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { json, error } from "../../lib/response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return error("Exercise ID required", 400);
  }

  // TODO: Fetch exercise from database
  return error("Exercise not found", 404);
};
