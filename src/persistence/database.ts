import type { Logger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

class MyLogger implements Logger {
	logQuery(query: string): void {
		console.log({ query });
	}
}

export const getDb = (env: { DB: D1Database }) => {
	return drizzle(env.DB, { logger: new MyLogger() });
};
