FROM node:20-alpine

WORKDIR /frontend
 
RUN npm install -g pnpm@9

# Copy lockfiles first for caching
COPY app/package.json app/pnpm-lock.yaml ./

# Install deps
RUN pnpm install --frozen-lockfile

# Copy app source
COPY app/ .

# Env
COPY app/.env.frontend .env

EXPOSE 5173

CMD ["pnpm", "dev", "--host"]
