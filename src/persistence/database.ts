import { drizzle } from "drizzle-orm/d1";

export const getDb = (env: { DB: D1Database }) => {
	return drizzle(env.DB, { logger: true });
};
