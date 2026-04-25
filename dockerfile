# 1. Base image
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# 2. Install dependencies
# 2. Install dependencies
FROM base AS deps
# We copy the root package.json and the backend files specifically
COPY package.json pnpm-workspace.yaml* ./
RUN mkdir -p apps/backend
COPY apps/backend/package.json apps/backend/pnpm-lock.yaml ./apps/backend/

# Install from the backend directory context
RUN pnpm install --filter backend

# 3. Build the backend
FROM deps AS builder
COPY . .
RUN pnpm --filter backend build

# 4. Production runner
FROM base AS runner
# Copy all workspace dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules

# COPY THE ENTIRE BACKEND FOLDER (Essential for V2)
COPY --from=builder /app/apps/backend ./apps/backend

WORKDIR /app/apps/backend
ENV NODE_ENV=production
EXPOSE 9000

# Run migrations and start
CMD ["sh", "-c", "pnpm medusa db:migrate && pnpm start"]