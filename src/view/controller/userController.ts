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

  public async getUserByEmail(c: Context)  {
    const email = c.req.query('email');

    if (!email) return c.text('メールアドレスが存在しません', 400)

    const result = await this.usecase.getUserByEmail(email)
    return c.json(result)
  }

  public async getUsers(c: Context)  {
    const result = await this.usecase.getUsers()
    return c.json(result)
  }

  public async getUserByID(c: Context) {
    const idParam = c.req.param('id')

    const id = parseInt(idParam, 10)
    if (isNaN(id)) return c.text('IDが不正です', 400)

    const result = await this.usecase.getUserByID(id)
    return c.json(result)
  }
}
