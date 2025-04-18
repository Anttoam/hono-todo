import { UserRepository } from "../../persistence/repository/userRepository";
import { User } from "../model/user";

export class UserUsecase {
  constructor(private readonly ur: UserRepository) {}

  public async register(name: string, email: string) {
    const newUser = new User(null, name, email)
    return await this.ur.insert(newUser);
  }
}
