import { z } from "zod";

export const registerInput = z.object({
	username: z.string().min(1, "ユーザー名を入力してください"),
	email: z.string().email("有効なメールアドレスではありません"),
	password: z.string().min(8, "8文字以上入力してください"),
});
