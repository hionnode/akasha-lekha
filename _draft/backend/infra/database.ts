// infra/database.ts

// Users table - stores user profiles
export const usersTable = new sst.aws.Dynamo('Users', {
  fields: {
    pk: 'string', // USER#<github_id>
    sk: 'string', // PROFILE
    gsi1pk: 'string', // EMAIL#<email>
    gsi1sk: 'string', // USER#<github_id>
  },
  primaryIndex: { hashKey: 'pk', rangeKey: 'sk' },
  globalIndexes: {
    gsi1: { hashKey: 'gsi1pk', rangeKey: 'gsi1sk' },
  },
});

// Progress table - stores exercise completions
export const progressTable = new sst.aws.Dynamo('Progress', {
  fields: {
    pk: 'string', // USER#<github_id>
    sk: 'string', // EXERCISE#<exercise_id>
    gsi1pk: 'string', // EXERCISE#<exercise_id>
    gsi1sk: 'string', // COMPLETED#<timestamp>
  },
  primaryIndex: { hashKey: 'pk', rangeKey: 'sk' },
  globalIndexes: {
    gsi1: { hashKey: 'gsi1pk', rangeKey: 'gsi1sk' },
  },
});

// Sessions table - stores auth sessions/tokens
export const sessionsTable = new sst.aws.Dynamo('Sessions', {
  fields: {
    pk: 'string', // SESSION#<token_hash>
    sk: 'string', // USER#<github_id>
  },
  primaryIndex: { hashKey: 'pk', rangeKey: 'sk' },
  ttl: 'expiresAt',
});

export const database = {
  usersTable,
  progressTable,
  sessionsTable,
};
