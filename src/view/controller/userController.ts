import type { D1Database } from "@cloudflare/workers-types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { registerInput } from "../../domain/dto/userDto";
import { UserUsecase } from "../../domain/usecase/userUsecase";
import { getDb } from "../../persistence/database";
import { UserRepository } from "../../persistence/repository/userRepository";

type Env = {
	Bindings: {
		DB: D1Database;
	};
};

const userRouter = new Hono<Env>();

const usecase = (bindings: Env["Bindings"]) => {
	const db = getDb(bindings);
	const userRepo = new UserRepository(db);
	return new UserUsecase(userRepo);
};

userRouter.post("/register", zValidator("form", registerInput), async (c) => {
	const validated = c.req.valid("form");
	const userUsecase = usecase(c.env);
	const result = await userUsecase.register(validated);

	if (result.isErr()) {
		return c.text(result.error.message, 400);
	}

	return c.json(result.value, 201);
});

userRouter.get("/list", async (c) => {
	const userUsecase = usecase(c.env);
	const result = await userUsecase.getUsers();
	return c.json(result);
});

userRouter.get("/:id", async (c) => {
	const idParam = c.req.param("id");

	const id = Number.parseInt(idParam, 10);
	if (Number.isNaN(id)) return c.text("IDが不正です", 400);
	const userUsecase = usecase(c.env);

	const result = await userUsecase.getUserByID(id);
	return c.json(result);
});

export default userRouter;
