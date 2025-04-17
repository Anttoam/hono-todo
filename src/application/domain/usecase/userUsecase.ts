import { UserRepository } from "../../../adaptor/persistence/repository/userRepository";
import { User } from "../model/user";

export class UserUsecase {
  constructor(private readonly ur: UserRepository) {}

  public async createUser(user: User): Promise<void> {
    const newUser = new User(user.id, user.name, user.age, user.email)
    await this.ur.insert(newUser);
  }
}
