import { Context } from "hono";
import { UserUsecase } from "../../domain/usecase/userUsecase";

export class UserController {
  constructor(private readonly usecase: UserUsecase) {}

  public create = async (c: Context) => {
    const { name, email } = await c.req.json();

    if (!name || !email) return c.text('名前またはメールアドレスが入力されていません', 400);

    const result = await this.usecase.register(name, email)
    return c.json(result)
  }
}
