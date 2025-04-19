import type { Context } from "hono";
import type { UserUsecase } from "../../domain/usecase/userUsecase";

export class UserController {
	constructor(private readonly usecase: UserUsecase) {}

	public async create(c: Context) {
		const { name, email } = await c.req.json();

		if (!name || !email)
			return c.text("名前またはメールアドレスが入力されていません", 400);

		const result = await this.usecase.register(name, email);
		return c.json(result);
	}

	public async getUsers(c: Context) {
		const result = await this.usecase.getUsers();
		return c.json(result);
	}

	public async getUserByID(c: Context) {
		const idParam = c.req.param("id");

		const id = Number.parseInt(idParam, 10);
		if (Number.isNaN(id)) return c.text("IDが不正です", 400);

		const result = await this.usecase.getUserByID(id);
		return c.json(result);
	}
}
