# 1. Base image
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# 2. Install dependencies
FROM base AS deps
# Copy root config files
COPY package.json pnpm-workspace.yaml* pnpm-lock.yaml* ./
# Copy backend-specific files
COPY apps/backend/package.json ./apps/backend/
# Use filter to install only backend-related modules
RUN pnpm install --filter backend

# 3. Build the backend
FROM deps AS builder
COPY . .
RUN pnpm --filter backend build

# 4. Production runner
FROM base AS runner
# Copy the root node_modules (where the actual binaries live)
COPY --from=deps /app/node_modules ./node_modules
# Copy the entire backend folder (includes the .medusa build artifacts)
COPY --from=builder /app/apps/backend ./apps/backend

WORKDIR /app/apps/backend
ENV NODE_ENV=production
EXPOSE 9000

# Run migrations and start
CMD ["sh", "-c", "pnpm medusa db:migrate && pnpm start"]
