import type { UserRepository } from "../../persistence/repository/userRepository";
import { User } from "../model/user";

export class UserUsecase {
	constructor(private readonly ur: UserRepository) {}

	public async register(name: string, email: string) {
		const newUser = new User(null, name, email);
		return await this.ur.insert(newUser);
	}

	public async getUserByEmail(email: string) {
		return await this.ur.getByEmail(email);
	}

	public async getUsers() {
		return await this.ur.getUsers();
	}

	public async getUserByID(id: number) {
		return await this.ur.getById(id);
	}
}
