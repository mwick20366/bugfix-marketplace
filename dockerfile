# 1. Base image
FROM node:20-slim
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. THE SECRET SAUCE: Force pnpm to hoist all dependencies
# This ensures Vite can find @medusajs/dashboard, draft-order, etc.
RUN echo "public-hoist-pattern[]=@medusajs/*" > .npmrc
RUN echo "shamefully-hoist=true" >> .npmrc

# 3. Copy the entire monorepo
COPY . .

# 4. Install EVERYTHING
# With the .npmrc above, all @medusajs packages will be visible to the backend
RUN pnpm install

# 5. Build the backend
WORKDIR /app/apps/backend
RUN npx medusa build

# 6. Production settings
ENV NODE_ENV=production
EXPOSE 9000

# 7. Run migrations and start
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
