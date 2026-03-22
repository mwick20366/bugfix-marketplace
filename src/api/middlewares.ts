// src/api/middlewares.ts
import { z } from "@medusajs/framework/zod"
import { defineMiddlewares, authenticate,  validateAndTransformBody, validateAndTransformQuery, } from "@medusajs/framework/http"
import { GetBugsSchema, PostCreateBugSchema } from "./bugs/validators"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"


export default defineMiddlewares({
  routes: [
    {
      matcher: "/clients",
      method: "POST",
      middlewares: [
        authenticate("client", ["session", "bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
  {
    matcher: "/clients/me",
    methods: ["GET"],
    middlewares: [
      authenticate("client", ["session", "bearer"]),
      validateAndTransformQuery(createFindParams(), {
        defaults: [
          "id",
          "email",
          "companyName",
          "contactFirstName",
          "contactLastName",
          "bugs.*", // retrieves all fields of linked bug records
        ],
        isList: false,
      }),
    ],
  },    
    {
      matcher: "/developers",
      method: "POST",
      middlewares: [
        authenticate("developer", ["session", "bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
    // Protect authenticated routes
    {
      matcher: "/clients/*",
      middlewares: [authenticate("client", ["session", "bearer"])],
    },
    {
      matcher: "/developers/*",
      middlewares: [authenticate("developer", ["session", "bearer"])],
    },
    {
      matcher: "/bugs",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetBugsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "description",
            "techStack",
            "bounty",
            "status",
            "developer_id",
            "created_at",
            "updated_at",
            "client.id",
            "client.companyName",
            "client.email",
            "client.contactFirstName",
            "client.contactLastName",
          ],
          defaultLimit: 15,
        }),
      ],
    },
    // Only clients can create bugs
    {
      matcher: "/bugs",
      methods: ["POST"],
      middlewares: [
      authenticate("client", ["session", "bearer"]),
      validateAndTransformBody(PostCreateBugSchema),
      ],
    },
    // Clients OR admins can update/delete bugs
    {
      matcher: "/bugs/:id",
      methods: ["POST", "DELETE"],
      middlewares: [
        authenticate(["client", "user"], ["session", "bearer", "api-key"]),
      ],
    },
    // Only developers can claim a bug
    {
      matcher: "/bugs/:id/claim",
      methods: ["POST"],
      middlewares: [
        authenticate("developer", ["session", "bearer"]),
      ],
    },
    {
      matcher: "/bugs/clients/:clientId",
      methods: ["GET"],
      middlewares: [
        authenticate(["client", "user"], ["session", "bearer", "api-key"]),
      ],
    },    
  ],
})