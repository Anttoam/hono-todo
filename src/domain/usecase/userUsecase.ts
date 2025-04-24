import bcrypt from "bcryptjs";
import { type Result, err, ok } from "neverthrow";
import type { z } from "zod";
import type { User } from "../../persistence/drizzle/schema";
import type { UserRepository } from "../../persistence/repository/userRepository";
import { editForm, idSchema, registerForm } from "../dto/userDto";
import { USECASE_ERRORS } from "../errors/usecaseError";

export class UserUsecase {
	constructor(private readonly userRepository: UserRepository) {}

	public async register(
		form: z.infer<typeof registerForm>,
	): Promise<Result<User, Error>> {
		const parsed = registerForm.safeParse(form);
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
		if (existing.isOk()) {
			return err(new Error("すでに存在するユーザーです"));
		}

		const result = await this.userRepository.insert(newUser);
		if (result.isErr()) {
			return err(new Error(`登録に失敗しました: ${result.error.message}`));
		}

		return ok(result.value);
	}

	public async getUsers(): Promise<Result<User[], Error>> {
		return await this.userRepository.getUsers();
	}

	public async getUserByID(
		id: z.infer<typeof idSchema>,
	): Promise<Result<User, Error>> {
		const parsed = idSchema.safeParse(id);
		if (parsed.error) {
			return err(new Error(USECASE_ERRORS.INVALID_ID_ERROR));
		}

		const result = await this.userRepository.getById(parsed.data.id);
		if (result.isErr()) {
			return err(new Error(`${result.error.message}`));
		}
		return ok(result.value);
	}

	public async delete(
		id: z.infer<typeof idSchema>,
	): Promise<Result<boolean, Error>> {
		const parsed = idSchema.safeParse(id);
		if (parsed.error) {
			return err(new Error(USECASE_ERRORS.INVALID_ID_ERROR));
		}

		const result = await this.userRepository.delete(parsed.data.id);
		if (result.isErr()) {
			return err(new Error(`${result.error.message}`));
		}
		return ok(true);
	}

	public async edit(
		id: z.infer<typeof idSchema>,
		form: z.infer<typeof editForm>,
	): Promise<Result<User, Error>> {
		const parsedID = idSchema.safeParse(id);
		if (parsedID.error) {
			return err(new Error(USECASE_ERRORS.INVALID_ID_ERROR));
		}
		const parsedForm = editForm.safeParse(form);
		if (parsedForm.error) {
			const message = parsedForm.error.errors
				.map((err) => err.message)
				.join(" / ");
			return err(new Error(message));
		}

		const editUser = {
			username: parsedForm.data.username,
			email: parsedForm.data.email,
		};

		const result = await this.userRepository.update(parsedID.data.id, editUser);
		if (result.isErr()) {
			return err(new Error(`${result.error.message}`));
		}
		return ok(result.value);
	}
}
