import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	username: text("username").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`), 
  updated_at: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});
export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
