// infra/api.ts
import { database } from './database';
import { auth } from './auth';

// Frontend URLs per environment
const frontendUrls: Record<string, string> = {
  prod: 'https://works-on-my.cloud',
  preview: 'https://preview.works-on-my.cloud',
};

const frontendUrl = frontendUrls[$app.stage] || 'http://localhost:4321';

export const api = new sst.aws.ApiGatewayV2('Api', {
  cors: {
    allowOrigins: [frontendUrl],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowCredentials: true,
  },
});

// Auth routes
api.route('GET /auth/github', {
  handler: 'packages/api/src/functions/auth/github.handler',
  link: [auth.githubClientId],
  environment: {
    FRONTEND_URL: frontendUrl,
  },
});

api.route('GET /auth/github/callback', {
  handler: 'packages/api/src/functions/auth/callback.handler',
  link: [
    auth.githubClientId,
    auth.githubClientSecret,
    auth.jwtSecret,
    database.usersTable,
    database.sessionsTable,
  ],
  environment: {
    FRONTEND_URL: frontendUrl,
  },
});

api.route('POST /auth/verify', {
  handler: 'packages/api/src/functions/auth/verify.handler',
  link: [auth.jwtSecret, database.sessionsTable],
});

api.route('POST /auth/logout', {
  handler: 'packages/api/src/functions/auth/logout.handler',
  link: [database.sessionsTable],
});

// Exercise routes (public)
api.route('GET /exercises', {
  handler: 'packages/api/src/functions/exercises/list.handler',
});

api.route('GET /exercises/{id}', {
  handler: 'packages/api/src/functions/exercises/get.handler',
});

// Progress routes (authenticated)
api.route('GET /progress', {
  handler: 'packages/api/src/functions/progress/get.handler',
  link: [auth.jwtSecret, database.progressTable, database.sessionsTable],
});

api.route('POST /exercises/{id}/verify', {
  handler: 'packages/api/src/functions/progress/record.handler',
  link: [auth.jwtSecret, database.progressTable, database.sessionsTable],
});
