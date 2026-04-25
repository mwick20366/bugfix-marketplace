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
# Copy the entire app directory from the builder
COPY --from=builder /app /app

# Set working directory to the backend app
WORKDIR /app/apps/backend

ENV NODE_ENV=production
EXPOSE 9000

# Call the binary using its absolute path in the monorepo root
CMD ["sh", "-c", "/app/node_modules/.bin/medusa db:migrate && /app/node_modules/.bin/medusa start"]
