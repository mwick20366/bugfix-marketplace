# 1. Base image
FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Builder stage
FROM base AS builder
# Copy EVERYTHING to ensure pnpm sees the workspace and all lockfiles
COPY . .
# Install and Build
RUN pnpm install --filter backend
RUN pnpm --filter backend build

# 3. Production runner
FROM base AS runner
# Copy the entire app directory from the builder (ensures all symlinks are preserved)
COPY --from=builder /app /app

# Set working directory to the backend app
WORKDIR /app/apps/backend

ENV NODE_ENV=production
EXPOSE 9000

# Use the pnpm exec command which is the most reliable way to run binaries in a monorepo
CMD ["sh", "-c", "pnpm medusa db:migrate && pnpm medusa start"]
