import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { User } from "../../domain/model/user";
import { users } from "../drizzle/schema";

export class UserRepository {
	constructor(private readonly db: DrizzleD1Database) {}

	public async insert(user: User) {
		return this.db.insert(users).values({
			name: user.name,
			email: user.email,
		});
	}

	public async getByEmail(email: string): Promise<User> {
		const [row] = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (!row) throw new Error("そのメールアドレスは存在しません");

		return {
			id: row.id,
			name: row.name,
			email: row.email,
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
			name: row.name,
			email: row.email,
		};
	}
}
