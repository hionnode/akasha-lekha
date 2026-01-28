// packages/api/src/lib/response.ts
import type { APIGatewayProxyResultV2 } from "aws-lambda";

export function json(data: unknown, statusCode = 200): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}

export function error(message: string, statusCode = 400): APIGatewayProxyResultV2 {
  return json({ error: message }, statusCode);
}

export function redirect(url: string): APIGatewayProxyResultV2 {
  return {
    statusCode: 302,
    headers: {
      Location: url,
    },
    body: "",
  };
}
