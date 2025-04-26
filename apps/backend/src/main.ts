import { Hono } from "hono";
import userRouter from "./view/controller/userController";

const app = new Hono();
app.get("/", (c) => c.text("Hello World"));
app.route("/users", userRouter);

export default app;
