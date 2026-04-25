# 1. Base image
FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Builder stage
FROM base AS builder
# Copy the entire project for monorepo context
COPY . .

# Install all dependencies for the backend
RUN pnpm install --filter backend

# Build the backend AND the Admin panel
# This generates the .medusa folder which contains the index.html you're missing
RUN pnpm --filter backend build

# 3. Production runner
FROM base AS runner
# Copy the entire app directory (preserving build artifacts and symlinks)
COPY --from=builder /app /app

# Set working directory to the backend app
WORKDIR /app/apps/backend

# Medusa production settings
ENV NODE_ENV=production
EXPOSE 9000

# Use npx to run migrations and start the server
# This bypasses all the binary path headaches
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
