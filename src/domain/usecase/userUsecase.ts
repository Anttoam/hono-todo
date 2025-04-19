import bcrypt from "bcryptjs";
import type { UserRepository } from "../../persistence/repository/userRepository";
import { registerInput } from "../dto/userDto";

export class UserUsecase {
	constructor(private readonly userRepository: UserRepository) {}

	public async register(username: string, email: string, password: string) {
		const clean = registerInput.safeParse({ username, email, password });
		if (!clean.success) {
			const message = clean.error.errors.map((err) => err.message).join(" / ");
			throw new Error(`${message}`);
		}
		const hashPassword = await bcrypt.hash(password, 10);
		const newUser = { username, email, password: hashPassword };

		if (await this.userRepository.getByEmail(email))
			throw new Error("すでに存在するユーザーです");

		return await this.userRepository.insert(newUser);
	}

	public async getUsers() {
		return await this.userRepository.getUsers();
	}

	public async getUserByID(id: number) {
		return await this.userRepository.getById(id);
	}
}
