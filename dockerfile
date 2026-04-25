# 1. Base image
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# 2. Install dependencies
FROM base AS deps
COPY package.json pnpm-workspace.yaml* pnpm-lock.yaml* ./
# Only copy the backend's package.json to stay lean
COPY apps/backend/package.json ./apps/backend/
# Tell pnpm to install everything at the root level
RUN pnpm install --filter backend

# 3. Build the backend
FROM deps AS builder
# Copy everything so the build has all the context it needs
COPY . .
RUN pnpm --filter backend build

# 4. Production runner
FROM base AS runner
# Copy the root node_modules where pnpm actually stores the packages
COPY --from=deps /app/node_modules ./node_modules
# Copy the entire backend directory from the builder stage
COPY --from=builder /app/apps/backend ./apps/backend

# IMPORTANT: Stay in the root for the final run or pnpm won't find the modules
WORKDIR /app/apps/backend
ENV NODE_ENV=production
EXPOSE 9000

# Run migrations and start
CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]
