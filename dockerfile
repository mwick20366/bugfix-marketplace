# 1. Base image
FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Builder stage
FROM base AS builder
# Copy EVERYTHING to keep workspace context
COPY . .

# Install dependencies from the root
RUN pnpm install --filter backend

# Run the build from the root using the filter
# This ensures pnpm finds the 'medusa' binary in the workspace
RUN pnpm --filter backend build

# 3. Production runner
FROM base AS runner
# Copy the compiled bundle. 
# Medusa v2 builds into [app-path]/.medusa/server
COPY --from=builder /app/apps/backend/.medusa/server /app/server

WORKDIR /app/server

# Install production-only deps for the standalone bundle
ENV NODE_ENV=production
RUN pnpm install --prod

EXPOSE 9000

# Use npx to run the commands from the local bundle
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
