# 1. Base image
FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Builder stage
FROM base AS builder
COPY . .
RUN pnpm install --filter backend
# Build the production-ready server bundle
RUN pnpm --filter backend build

# 3. Production runner
FROM base AS runner
# Copy ONLY the compiled production bundle
COPY --from=builder /app/apps/backend/.medusa/server /app

WORKDIR /app
# Medusa Cloud runs as production
ENV NODE_ENV=production
EXPOSE 9000

# Install the dependencies required specifically for the bundled server
RUN pnpm install --prod

# Start exactly like Medusa Cloud
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
