FROM node:20-slim

# 1. Setup pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Copy the entire project
# This ensures pnpm sees the root lockfile, workspace, and all app files at once
COPY . .

# 3. Install and Build
# We run a full install so pnpm builds the proper binary links in the root
RUN pnpm install
RUN pnpm --filter backend build

# 4. Set the working directory to the backend
WORKDIR /app/apps/backend

# 5. Environment and Port
ENV NODE_ENV=production
EXPOSE 9000

# 6. Use the direct internal path that pnpm MUST create during install
CMD ["sh", "-c", "../../node_modules/.bin/medusa db:migrate && "../../node_modules/.bin/medusa start"]
