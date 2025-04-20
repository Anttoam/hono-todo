import type { D1Database } from "@cloudflare/workers-types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { idSchema, registerForm } from "../../domain/dto/userDto";
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

userRouter.post("/register", zValidator("form", registerForm), async (c) => {
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

	if (result.isErr()) {
		return c.text(result.error.message, 400);
	}

	return c.json(result);
});

userRouter.get("/:id", zValidator("param", idSchema), async (c) => {
	const params = c.req.valid("param");
	const userUsecase = usecase(c.env);
	const result = await userUsecase.getUserByID(params);
	if (result.isErr()) {
		return c.text(result.error.message, 400);
	}
	return c.json(result.value, 200);
});

export default userRouter;
