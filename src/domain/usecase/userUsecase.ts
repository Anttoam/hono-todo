import bcrypt from "bcryptjs";
import { type Result, err, ok } from "neverthrow";
import type { z } from "zod";
import type { User } from "../../persistence/drizzle/schema";
import type { UserRepository } from "../../persistence/repository/userRepository";
import { registerInput } from "../dto/userDto";

export class UserUsecase {
	constructor(private readonly userRepository: UserRepository) {}

	public async register(
		input: z.infer<typeof registerInput>,
	): Promise<Result<User, Error>> {
		const parsed = registerInput.safeParse(input);
		if (parsed.error) {
			const message = parsed.error.errors.map((err) => err.message).join(" / ");
			return err(new Error(message));
		}

		const hashPassword = await bcrypt.hash(parsed.data.password, 10);
		const newUser = {
			username: parsed.data.username,
			email: parsed.data.email,
			password: hashPassword,
		};

		const existing = await this.userRepository.getByEmail(newUser.email);
		if (existing) {
			return err(new Error("すでに存在するユーザーです"));
		}

		const result = await this.userRepository.insert(newUser);
		if (result.isErr()) {
			return err(new Error(`登録に失敗しました: ${result.error.message}`));
		}

		return ok(result.value);
	}

	public async getUsers() {
		return await this.userRepository.getUsers();
	}

	public async getUserByID(id: number) {
		return await this.userRepository.getById(id);
	}
}
