import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { type Result, err, ok } from "neverthrow";
import { type NewUser, type User, users } from "../drizzle/schema";

export class UserRepository {
	constructor(private readonly db: DrizzleD1Database) {}

	public async insert(user: NewUser): Promise<Result<User, Error>> {
		try {
			const [row] = await this.db
				.insert(users)
				.values({
					username: user.username,
					email: user.email,
					password: user.password,
				})
				.returning();

			if (!row) return err(new Error("ユーザーの挿入に失敗しました"));

			return ok(row);
		} catch (e) {
			return err(
				e instanceof Error
					? e
					: new Error("データベース処理中にエラーが発生しました"),
			);
		}
	}

	public async getByEmail(email: string): Promise<Result<User, Error>> {
		try {
			const [row] = await this.db
				.select()
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			if (!row) return err(new Error("データが存在しません"));

			return ok(row);
		} catch (e) {
			return err(
				e instanceof Error
					? e
					: new Error("データベース処理中にエラーが発生しました"),
			);
		}
	}

	public async getUsers(): Promise<Result<User[], Error>> {
		try {
			const result = await this.db.select().from(users);
			if (result.length === 0) return err(new Error("ユーザーが存在しません"));

			return ok(result);
		} catch (e) {
			return err(
				e instanceof Error
					? e
					: new Error("データベース処理中にエラーが発生しました"),
			);
		}
	}

	public async getById(id: number): Promise<Result<User, Error>> {
		try {
			const [row] = await this.db
				.select()
				.from(users)
				.where(eq(users.id, id))
				.limit(1);

			if (!row) return err(new Error("ユーザーが存在しません"));

			return ok(row);
		} catch (e) {
			return err(
				e instanceof Error
					? e
					: new Error("データベース処理中にエラーが発生しました"),
			);
		}
	}
}
