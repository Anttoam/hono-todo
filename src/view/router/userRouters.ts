import { Hono } from "hono";
import { getDb } from "../../persistence/database";
import { UserRepository } from "../../persistence/repository/userRepository";
import { UserUsecase } from "../../domain/usecase/userUsecase";
import { UserController } from "../controller/userController";

type Bindings = {
  DB: D1Database;
};

type Variables = {
  userController: UserController;
};

const userRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

userRoutes.use(async (c, next) => {
  const db = getDb(c.env);
  const repo = new UserRepository(db);
  const usecase = new UserUsecase(repo);
  c.set("userController", new UserController(usecase));
  await next();
});

userRoutes.post("/", (c) => {
  const controller = c.get("userController");
  return controller.create(c);
});

userRoutes.get("/email", (c) => {
  const controller = c.get("userController");
  return controller.getUserByEmail(c);
});


export default userRoutes;
