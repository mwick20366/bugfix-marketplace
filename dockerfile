# 1. Base image
FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Install dependencies
# We copy EVERYTHING first to ensure pnpm sees the workspace structure
FROM base AS builder
COPY . .

# Install only the backend dependencies
RUN pnpm install --filter backend

# Build the backend
RUN pnpm --filter backend build

# 3. Production runner
FROM base AS runner
# Copy the entire app folder from builder (safest for monorepos)
COPY --from=builder /app /app

# Set working directory to the backend app
WORKDIR /app/apps/backend

ENV NODE_ENV=production
EXPOSE 9000

# Run migrations and start
# Change the last line to use absolute paths from the /app root:
# This finds the medusa binary automatically, regardless of where pnpm placed it
CMD ["sh", "-c", "$(find /app -name medusa | grep .bin/medusa | head -n 1) db:migrate && $(find /app -name medusa | grep .bin/medusa | head -n 1) start"]
