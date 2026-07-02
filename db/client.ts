import "server-only";
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Reuse the client across hot-reloads in dev to avoid opening many handles.
const globalForDb = globalThis as unknown as {
  __libsqlClient?: Client;
  __drizzleDb?: LibSQLDatabase<typeof schema>;
};

const client =
  globalForDb.__libsqlClient ??
  createClient({ url: process.env.DATABASE_URL ?? "file:./civicgrid.db" });

export const db = globalForDb.__drizzleDb ?? drizzle(client, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__libsqlClient = client;
  globalForDb.__drizzleDb = db;
}

export { schema };
