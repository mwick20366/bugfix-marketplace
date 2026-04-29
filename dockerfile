# 1. Base image
FROM node:20-slim
WORKDIR /app

# 2. Copy workspace config and package files
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/

# 3. THE FIX: Use --legacy-peer-deps to ignore React 19 conflicts
# Use 'npm ci' for a clean, frozen install, but we still need the peer-deps flag
RUN npm install --legacy-peer-deps

# 4. Copy the rest of the source code
COPY . .

# 5. Build the backend
WORKDIR /app/apps/backend
RUN npx medusa build

# 6. Production settings
ENV NODE_ENV=production
EXPOSE 9000

# 7. Start the server
# We use --legacy-peer-deps again here just in case any dynamic linking happens
CMD ["sh", "-c", "cd .medusa/server && npm install --legacy-peer-deps && npx medusa db:migrate && npx medusa start"]
