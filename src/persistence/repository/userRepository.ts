import { DrizzleD1Database } from "drizzle-orm/d1";
import { users } from "../drizzle/schema";
import { User } from "../../domain/model/user";

export class UserRepository {
  constructor(private readonly db: DrizzleD1Database) {}
  public async insert(user: User) {
    return this.db.insert(users).values({
      name: user.name, 
      email: user.email, 
    })
  }
}
