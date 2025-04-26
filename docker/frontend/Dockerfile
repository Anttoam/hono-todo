FROM node:22-bookworm-slim

RUN npm install -g pnpm

WORKDIR /app/apps/frontend

COPY ./apps/frontend ./
RUN pnpm install

EXPOSE 5173

CMD ["pnpm", "run", "dev"]
