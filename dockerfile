# 1. Base image
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# 2. Install dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile

# 3. Build the backend
FROM deps AS builder
COPY . .
RUN pnpm --filter backend build

# 4. Production runner
FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
# Medusa needs the config file at runtime
COPY --from=builder /app/apps/backend/medusa-config.js ./apps/backend/

WORKDIR /app/apps/backend
ENV NODE_ENV=production
EXPOSE 9000

# Run migrations and start
CMD ["sh", "-c", "pnpm medusa db:migrate && pnpm start"]
