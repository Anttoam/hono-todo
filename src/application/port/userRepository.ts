import { User } from "../../adaptor/persistence/drizzle/schema";

export interface IUserRepository {
  insert(user: User): Promise<void>;
}
