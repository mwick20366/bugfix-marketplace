# 1. Base image
FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Builder stage
FROM base AS builder
# Copy the entire monorepo for context
COPY . .

# Install all dependencies for the backend
RUN pnpm install --filter backend

# Run the build from the backend directory
# This generates the standalone bundle in apps/backend/.medusa/server
WORKDIR /app/apps/backend
RUN pnpm medusa build

# 3. Production runner
FROM base AS runner
# Copy the bundle from the builder stage
# We use the relative path from the builder's /app root
COPY --from=builder /app/apps/backend/.medusa/server /app/server

# Set working directory to the bundled server
WORKDIR /app/server

# Medusa v2 production bundle needs its own production dependencies
ENV NODE_ENV=production
RUN pnpm install --prod

EXPOSE 9000

# Start from the bundled output exactly like Medusa Cloud
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
