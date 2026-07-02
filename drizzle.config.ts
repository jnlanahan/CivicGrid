import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso", // libSQL dialect — "sqlite" will not wire the driver correctly
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./civicgrid.db",
  },
});
