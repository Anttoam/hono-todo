import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { type NewUser, type User, users } from "../drizzle/schema";

export class UserRepository {
	constructor(private readonly db: DrizzleD1Database) {}

	public async insert(user: NewUser) {
		return this.db.insert(users).values({
			username: user.username,
			email: user.email,
      password: user.password, 
		});
	}

	public async getByEmail(email: string): Promise<User | undefined> {
		const [row] = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (!row) return undefined;

		return {
			id: row.id,
			username: row.username,
			email: row.email,
			password: row.password,
      created_at: row.created_at, 
      updated_at: row.updated_at, 
		};
	}

	public async getUsers(): Promise<User[]> {
		const result = await this.db.select().from(users);

		if (result.length === 0) throw new Error("ユーザーが存在しません");

		return result;
	}

	public async getById(id: number): Promise<User> {
		const [row] = await this.db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1);

		if (!row) throw new Error("ユーザーが存在しません");

		return {
			id: row.id,
			username: row.username,
			email: row.email,
			password: row.password,
      created_at: row.created_at, 
      updated_at: row.updated_at, 
		};
	}
}
