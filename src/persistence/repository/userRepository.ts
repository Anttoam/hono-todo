import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { type Result, err, ok } from "neverthrow";
import { type NewUser, type User, users } from "../drizzle/schema";
import { DB_ERRORS } from "../errors/dbErros";

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

			if (!row) return err(new Error(DB_ERRORS.INSERT_FAILED));

			return ok(row);
		} catch (e) {
			return err(e instanceof Error ? e : new Error(DB_ERRORS.GENERIC_ERROR));
		}
	}

	public async getByEmail(email: string): Promise<Result<User, Error>> {
		try {
			const [row] = await this.db
				.select()
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			if (!row) return err(new Error(DB_ERRORS.NOT_FOUND));

			return ok(row);
		} catch (e) {
			return err(e instanceof Error ? e : new Error(DB_ERRORS.GENERIC_ERROR));
		}
	}

	public async getUsers(): Promise<Result<User[], Error>> {
		try {
			const result = await this.db.select().from(users);
			return ok(result);
		} catch (e) {
			return err(e instanceof Error ? e : new Error(DB_ERRORS.GENERIC_ERROR));
		}
	}

	public async getById(id: number): Promise<Result<User, Error>> {
		try {
			const [row] = await this.db
				.select()
				.from(users)
				.where(eq(users.id, id))
				.limit(1);

			if (!row) return err(new Error(DB_ERRORS.NOT_FOUND));

			return ok(row);
		} catch (e) {
			return err(e instanceof Error ? e : new Error(DB_ERRORS.GENERIC_ERROR));
		}
	}

	public async delete(id: number): Promise<Result<boolean, Error>> {
		try {
			const result = await this.db
				.delete(users)
				.where(eq(users.id, id))
				.returning();
			if (!result) {
				return err(new Error(DB_ERRORS.NOT_FOUND));
			}
			return ok(true);
		} catch (e) {
			return err(e instanceof Error ? e : new Error(DB_ERRORS.GENERIC_ERROR));
		}
	}
}
