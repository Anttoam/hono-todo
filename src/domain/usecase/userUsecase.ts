import bcrypt from "bcryptjs";
import type { UserRepository } from "../../persistence/repository/userRepository";

export class UserUsecase {
	constructor(private readonly ur: UserRepository) {}

	public async register(username: string, email: string, password: string) {
		const hashPassword = await bcrypt.hash(password, 10);
		const newUser = { username, email, password: hashPassword };

		if (await this.ur.getByEmail(email))
			throw new Error("すでに存在するユーザーです");

		return await this.ur.insert(newUser);
	}

	public async getUsers() {
		return await this.ur.getUsers();
	}

	public async getUserByID(id: number) {
		return await this.ur.getById(id);
	}
}
