import type { Context } from "hono";
import type { UserUsecase } from "../../domain/usecase/userUsecase";

export class UserController {
	constructor(private readonly userUsecase: UserUsecase) {}

	public async create(c: Context) {
		try {
			const { username, email, password } = await c.req.json();
			const result = await this.userUsecase.register(username, email, password);
			return c.json(result);
		} catch (err) {
			if (err instanceof Error) {
				return c.text(err.message, 400);
			}
			return c.text("予期しないエラーが発生しました", 500);
		}
	}

	public async getUsers(c: Context) {
		const result = await this.userUsecase.getUsers();
		return c.json(result);
	}

	public async getUserByID(c: Context) {
		const idParam = c.req.param("id");

		const id = Number.parseInt(idParam, 10);
		if (Number.isNaN(id)) return c.text("IDが不正です", 400);

		const result = await this.userUsecase.getUserByID(id);
		return c.json(result);
	}
}
