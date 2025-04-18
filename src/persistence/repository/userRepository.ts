import { DrizzleD1Database } from "drizzle-orm/d1";
import { users } from "../drizzle/schema";
import { User } from "../../domain/model/user";
import { eq } from "drizzle-orm";

export class UserRepository {
  constructor(private readonly db: DrizzleD1Database) {}

  public async insert(user: User) {
    return this.db.insert(users).values({
      name: user.name, 
      email: user.email, 
    })
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
}
