import { attachDatabasePool } from "@vercel/functions";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let db: NodePgDatabase<typeof schema> | undefined;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");

  if (!db) {
    const pool = new Pool({ connectionString });
    attachDatabasePool(pool);
    db = drizzle(pool, { schema });
  }

  return db;
}
