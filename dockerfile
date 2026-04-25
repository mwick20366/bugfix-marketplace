# 1. Use Node base
FROM node:20-slim
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Copy the ENTIRE monorepo
COPY . .

# 3. Install ALL dependencies
# We remove the filter here to ensure the Dashboard and all peer deps are available
RUN pnpm install

# 4. Explicitly add the dashboard package to the backend folder
# This ensures Vite can resolve the import that's currently failing
WORKDIR /app/apps/backend
RUN pnpm add @medusajs/dashboard

# 5. Build the production-ready server and admin
# This will now find @medusajs/dashboard and finish the build
RUN npx medusa build

# 6. Production settings
ENV NODE_ENV=production
EXPOSE 9000

# 7. Run migrations and start
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
