// src/api/middlewares.ts
import { z } from "@medusajs/framework/zod"
import { defineMiddlewares, authenticate,  validateAndTransformBody, validateAndTransformQuery, } from "@medusajs/framework/http"
import { GetBugsSchema, PostCreateBugSchema, SubmitBugFixSchema } from "./bugs/validators"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { GetSubmissionsSchema } from "./submissions/validators"

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
    {
      matcher: "/developers/me",
      methods: ["GET"],
      middlewares: [
      authenticate("developer", ["session", "bearer"]),
      validateAndTransformQuery(createFindParams(), {
        defaults: [
          "id",
          "email",
          "firstName",
          "lastName",
          "bugs.*", // retrieves all fields of linked bug records
          "submissions.*", // retrieves all fields of linked submission records
        ],
        isList: false,
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
        authenticate(["client", "developer", "user"], ["session", "bearer", "api-key"]),
        validateAndTransformQuery(GetBugsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "description",
            "techStack",
            "bounty",
            "status",
            "created_at",
            "updated_at",
            "developer.*", // retrieves all fields of linked developer record
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
    {
      matcher: "/submissions",
      methods: ["GET"],
      middlewares: [
        authenticate(["client", "developer", "user"], ["session", "bearer", "api-key"]),
        validateAndTransformQuery(GetSubmissionsSchema, {
          isList: true,
          defaults: [
            "id",
            "notes",
            "fileUrl",
            "status",
            "created_at",
            "updated_at",
            "bug.*",
            "bug.developer.*", // retrieves all fields of linked developer record for the bug
            "bug.client.*",
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
    // Only developers can submit a fix for a bug
    {
      matcher: "/bugs/:id/submit-fix",
      methods: ["POST"],
      middlewares: [
        authenticate(["developer"], ["session", "bearer"]),
        validateAndTransformBody(SubmitBugFixSchema),
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