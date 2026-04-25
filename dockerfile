# 1. Base image
FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Builder stage
FROM base AS builder
COPY . .
# Install and Build
RUN pnpm install --filter backend
RUN pnpm --filter backend build

# 3. Production runner
FROM base AS runner
# Copy EVERYTHING from builder
COPY --from=builder /app /app

# IMPORTANT: Re-link the binaries so the shortcuts aren't broken
RUN pnpm install --filter backend --offline --prod

WORKDIR /app/apps/backend

ENV NODE_ENV=production
EXPOSE 9000

# Now pnpm will definitely find 'medusa'
CMD ["sh", "-c", "pnpm medusa db:migrate && pnpm medusa start"]
