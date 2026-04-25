# 1. Use the same node version as your laptop
FROM node:20-slim
RUN corepack enable && corepack prepare pnpm@latest --activate

# 2. Set the working directory
WORKDIR /app

# 3. Copy the ENTIRE monorepo
COPY . .

# 4. Install and Build just like you do locally
RUN pnpm install
RUN pnpm --filter backend build

# 5. Move into the backend directory
WORKDIR /app/apps/backend

# 6. Production settings
ENV NODE_ENV=production
EXPOSE 9000

# 7. Use npx - it works on your laptop, it will work here.
# We run the build AGAIN here just to be 1000% sure the admin index.html is generated in the right spot
RUN npx medusa build

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
