import type { D1Database } from "@cloudflare/workers-types";
import { Hono } from "hono";
import { editForm, idSchema, registerForm } from "../../domain/dto/userDto";
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

userRouter.post("/register", async (c) => {
	const form = await c.req.json();
	const parsedForm = registerForm.safeParse(form);
	if (parsedForm.error) {
		return c.json({ error: "正しい入力ではありません" }, 400);
	}
	const userUsecase = usecase(c.env);
	const result = await userUsecase.register(parsedForm.data);

	if (result.isErr()) {
		return c.json({ error: result.error.message }, 400);
	}

	return c.json(result.value, 201);
});

userRouter.get("/list", async (c) => {
	const userUsecase = usecase(c.env);
	const result = await userUsecase.getUsers();

	if (result.isErr()) {
		return c.json({ error: result.error.message }, 400);
	}

	return c.json(result);
});

userRouter.get("/:id", async (c) => {
	const id = c.req.param("id");
	const parsed = idSchema.safeParse({ id });
	if (parsed.error) {
		return c.json({ error: "正しい入力ではありません" }, 400);
	}

	const userUsecase = usecase(c.env);
	const result = await userUsecase.getUserByID(parsed.data);
	if (result.isErr()) {
		return c.json({ error: result.error.message }, 400);
	}
	return c.json(result.value, 200);
});

userRouter.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const parsed = idSchema.safeParse({ id });
	if (parsed.error) {
		return c.json({ error: "正しい入力ではありません" }, 400);
	}

	const userUsecase = usecase(c.env);
	const result = await userUsecase.delete(parsed.data);
	if (result.isErr()) {
		return c.json({ error: result.error.message }, 400);
	}
	return c.json(result.isOk, 200);
});

userRouter.put("/:id", async (c) => {
	const id = c.req.param("id");
	const parsedID = idSchema.safeParse({ id });
	if (parsedID.error) {
		return c.json({ error: "正しい入力ではありません" }, 400);
	}
	const form = await c.req.json();
	const parsedForm = editForm.safeParse(form);
	if (parsedForm.error) {
		return c.json({ error: "正しい入力ではありません" }, 400);
	}

	const userUsecase = usecase(c.env);
	const result = await userUsecase.edit(parsedID.data, parsedForm.data);
	if (result.isErr()) {
		return c.json({ error: result.error.message }, 400);
	}
	return c.json(result.value, 200);
});

export default userRouter;
