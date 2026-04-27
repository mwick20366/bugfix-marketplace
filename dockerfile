# 1. Base image
FROM node:20-slim
WORKDIR /app

# 2. Copy workspace config files and package.json files first
# (optimizes Docker layer caching — dependencies only reinstall when these change)
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/

# 3. Install dependencies
RUN npm install --frozen-lockfile

# 4. Copy the rest of the source code
COPY . .

# 5. Build the backend
WORKDIR /app/apps/backend
RUN npx medusa build

# 6. Production settings
ENV NODE_ENV=production
EXPOSE 9000

# 7. Run migrations and start from the built output directory
CMD ["sh", "-c", "cd /app/apps/backend/.medusa/server && npm install && npx medusa db:migrate && npx medusa start"]