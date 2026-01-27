// sst.config.ts
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "akasha-labs",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage ?? ""),
      home: "aws",
      providers: {
        aws: {
          region: "ap-south-1",
        },
      },
    };
  },
  async run() {
    // Import infrastructure modules
    const { database } = await import("./infra/database");
    const { auth } = await import("./infra/auth");
    const { api } = await import("./infra/api");

    return {
      api: api.url,
      tables: {
        users: database.usersTable.name,
        progress: database.progressTable.name,
        sessions: database.sessionsTable.name,
      },
    };
  },
});
