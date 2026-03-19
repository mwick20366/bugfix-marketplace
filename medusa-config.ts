// medusa-config.ts
import { loadEnv, defineConfig } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      authMethodsPerActor: {
        user: ["emailpass"],
        client: ["emailpass"],
        developer: ["emailpass"],
      },
    },
  },
  modules: [
    // Register your custom modules
    {
      resolve: "./src/modules/client",
    },
    {
      resolve: "./src/modules/developer",
    },
    {
      resolve: "./src/modules/bug",
    },
    // Configure the Auth Module to include the emailpass provider
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },
  ],
})