# 1. Base image
FROM node:20-slim
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Add .npmrc with recommended pnpm hoisting patterns
RUN echo "public-hoist-pattern[]=*@medusajs/*" > .npmrc && \
    echo "public-hoist-pattern[]=@tanstack/react-query" >> .npmrc && \
    echo "public-hoist-pattern[]=react-i18next" >> .npmrc && \
    echo "public-hoist-pattern[]=react-router-dom" >> .npmrc

# 3. Copy workspace config files and package.json files first
# (optimizes Docker layer caching — dependencies only reinstall when these change)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/

# 4. Install dependencies
RUN pnpm install --frozen-lockfile

# 5. Copy the rest of the source code
COPY . .

# 6. Build the backend
WORKDIR /app/apps/backend
RUN pnpm medusa build

# 7. Production settings
ENV NODE_ENV=production
EXPOSE 9000

# 8. Run migrations and start from the built output directory
CMD ["sh", "-c", "cd /app/apps/backend/.medusa/server && pnpm install && npx medusa db:migrate && npx medusa start"]