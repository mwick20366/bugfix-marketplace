FROM node:20-slim

# 1. Setup pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Copy the entire project
COPY . .

# 3. Install and Build
RUN pnpm install
RUN pnpm --filter backend build

# 4. Set the working directory to the backend
WORKDIR /app/apps/backend

# 5. Environment and Port
ENV NODE_ENV=production
EXPOSE 9000

# 6. FIXED CMD: No complex quotes, just the direct path
CMD ["sh", "-c", "../../node_modules/.bin/medusa db:migrate && ../../node_modules/.bin/medusa start"]
