// packages/api/src/functions/auth/github.ts
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { redirect } from "../../lib/response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const redirectUri = `${event.requestContext.domainName}/auth/github/callback`;

  const params = new URLSearchParams({
    client_id: Resource.GithubClientId.value,
    redirect_uri: `https://${redirectUri}`,
    scope: "read:user user:email",
    state: crypto.randomUUID(),
  });

  return redirect(`https://github.com/login/oauth/authorize?${params}`);
};
