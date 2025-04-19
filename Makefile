format:
	bunx biome format --write src/*

lint:
	bunx biome lint --write src/*

check:
	bunx biome check --write src/*

migrate:
	sqlite3def local.db < misc/migrations/todo.sql

