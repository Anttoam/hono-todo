import { DrizzleD1Database } from "drizzle-orm/d1";
import { User, usersTable } from "../drizzle/schema";

export class UserRepository {
  constructor(private readonly db: DrizzleD1Database) {}
  public async insert(user: User) {
    return this.db.insert(usersTable).values({
      id: user.id, 
      name: user.name, 
      email: user.email, 
      age: user.age, 
    })
  }
}
