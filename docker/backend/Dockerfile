FROM node:22-bookworm-slim

RUN npm install -g pnpm

WORKDIR /app/apps/backend

COPY ./apps/backend ./
RUN pnpm install

EXPOSE 8787

CMD ["pnpm", "run", "dev"]
