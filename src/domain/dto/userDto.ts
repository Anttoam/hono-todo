import { z } from "zod";

export const registerForm = z.object({
	username: z.string().min(1, "ユーザー名を入力してください"),
	email: z.string().email("有効なメールアドレスではありません"),
	password: z.string().min(8, "パスワードは8文字以上入力してください"),
});

export const idSchema = z.object({
	id: z.coerce.number().int().positive(),
});

export const editForm = z.object({
	username: z.string().min(1, "ユーザー名を入力してください"),
	email: z.string().email("有効なメールアドレスではありません"),
});
