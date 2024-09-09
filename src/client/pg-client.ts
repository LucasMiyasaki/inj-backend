import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const postgresUrl = process.env.DATABASE_URL;

export class connectionPool {
  private static instance: Pool | null = null;

  private constructor() {
    connectionPool.instance = new Pool({
      connectionString: postgresUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  public static getInstance(): Pool {
    if (!connectionPool.instance) {
      new connectionPool();
    }
    return connectionPool.instance!;
  }
}
