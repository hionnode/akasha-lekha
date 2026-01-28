// infra/auth.ts

// Store secrets in SST (set via: pnpm sst secret set <name> <value> --stage <stage>)
export const githubClientId = new sst.Secret("GithubClientId");
export const githubClientSecret = new sst.Secret("GithubClientSecret");
export const jwtSecret = new sst.Secret("JwtSecret");

export const auth = {
  githubClientId,
  githubClientSecret,
  jwtSecret,
};
