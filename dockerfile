# 1. Base image
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# 2. Install dependencies
FROM base AS deps
COPY package.json pnpm-workspace.yaml* pnpm-lock.yaml* ./
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --filter backend

# 3. Build the backend
FROM deps AS builder
COPY . .
RUN pnpm --filter backend build

# 4. Production runner
FROM base AS runner
COPY package.json pnpm-workspace.yaml* pnpm-lock.yaml* ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend ./apps/backend

WORKDIR /app/apps/backend
ENV NODE_ENV=production
EXPOSE 9000

# Use the direct path to the medusa binary relative to the app folder
CMD ["sh", "-c", "../../node_modules/.bin/medusa db:migrate && ../../node_modules/.bin/medusa start"]
