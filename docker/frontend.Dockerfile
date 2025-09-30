FROM node:24-alpine

WORKDIR /frontend
RUN corepack enable
COPY app .
COPY app/.env.frontend .env

RUN CI=true pnpm install
EXPOSE 5173

CMD [ "npx", "vite","--host" ]