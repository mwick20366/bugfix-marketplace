// src/api/middlewares.ts
import { defineMiddlewares, authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/client",
      method: "POST",
      middlewares: [
        authenticate("client", ["session", "bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
    {
      matcher: "/developer",
      method: "POST",
      middlewares: [
        authenticate("developer", ["session", "bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
    // Protect authenticated routes
    {
      matcher: "/client/*",
      middlewares: [authenticate("client", ["session", "bearer"])],
    },
    {
      matcher: "/developer/*",
      middlewares: [authenticate("developer", ["session", "bearer"])],
    },
  ],
})