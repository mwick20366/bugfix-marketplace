// src/api/middlewares.ts
import { z } from "@medusajs/framework/zod"
import { defineMiddlewares, authenticate,  validateAndTransformBody, validateAndTransformQuery, MedusaRequest, MedusaResponse, MedusaNextFunction, } from "@medusajs/framework/http"
import { GetBugsSchema, PostCreateBugSchema, SubmitBugFixSchema } from "./bugs/validators"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { GetSubmissionsSchema } from "./submissions/validators"
import { PostCreateSubmissionSchema, PostApproveSubmissionSchema, PostRejectSubmissionSchema } from "./submissions/validators"
import { PostCaptureSubmissionSchema } from "./submissions/[id]/finalize-approval/route"
import { PostDeveloperReviewSchema } from "./developer-reviews/route"
import { PostMessageSchema } from "./bugs/[id]/messages/validators"
import { MarkMessagesReadSchema } from "./bugs/[id]/messages/mark-read/validators"
import { ConfigModule } from "@medusajs/framework"
import cors from "cors"
import { parseCorsOrigins } from "@medusajs/framework/utils"

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
            "company_name",
            "contact_first_name",
            "contact_last_name",
            "bugs.*", // retrieves all fields of linked bug records
            "submissions.*", // retrieves all fields of linked submission records
          ],
          isList: false,
        }),
      ],
    },
    {
      matcher: "/clients/me/notifications*",
      middlewares: [authenticate("client", ["session", "bearer"])],
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
          "first_name",
          "last_name",
          "bugs.*", // retrieves all fields of linked bug records
          "submissions.*", // retrieves all fields of linked submission records
          "reviews.*", // retrieves all fields of linked developer review records
        ],
        isList: false,
      }),
      ],
    },
    {
      matcher: "/developers/me/notifications*",
      middlewares: [authenticate("developer", ["session", "bearer"])],
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
    // Apply CORS to all /bugs* routes
    {
      matcher: "/bugs*",
      middlewares: [
        (
          req: MedusaRequest,
          res: MedusaResponse,
          next: MedusaNextFunction
        ) => {
          const configModule: ConfigModule =
            req.scope.resolve("configModule")

          return cors({
            origin: parseCorsOrigins(
              configModule.projectConfig.http.storeCors
            ),
            credentials: true,
          })(req, res, next)
        },
      ],
    },
    // Protect the messages routes — authenticated clients and developers only
    {
      matcher: "/bugs/:bugId/messages*",
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
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
            "tech_stack",
            "repo_link",
            "bounty",
            "difficulty",
            "status",
            "created_at",
            "updated_at",
            "claimed_at",
            "developer.*", // retrieves all fields of linked developer record
            "client.id",
            "client.company_name",
            "client.email",
            "client.contact_first_name",
            "client.contact_last_name",
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
            "file_url",
            "status",
            "created_at",
            "updated_at",
            "client_notes",
            "bug.*",
            "bug.developer.*", // retrieves all fields of linked developer record for the bug
            "bug.client.*",
          ],
          defaultLimit: 15,
        }),
      ],
    },
    {
      matcher: "/submissions",
      methods: ["POST"],
      middlewares: [
      authenticate("client", ["session", "bearer"]),
      validateAndTransformBody(PostCreateSubmissionSchema),
      ],
    },
    {
      matcher: "/submissions/:id/initiate-approval",
      methods: ["POST"],
      middlewares: [
        authenticate(["client"], ["session", "bearer"]),
        validateAndTransformBody(PostApproveSubmissionSchema),
      ],
    },
    {
      matcher: "/submissions/:id/finalize-approval",
      methods: ["POST"],
      middlewares: [
        authenticate(["client"], ["session", "bearer"]),
        validateAndTransformBody(PostCaptureSubmissionSchema),
      ],
    },    
    {
      matcher: "/submissions/:id/reject",
      methods: ["POST"],
      middlewares: [
        authenticate(["client"], ["session", "bearer"]),
        validateAndTransformBody(PostRejectSubmissionSchema),
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
      matcher: "/bugs/:id/messages",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostMessageSchema),
      ],
    },
    {
      matcher: "/bugs/:id/messages/mark-read",
      method: "POST",
      middlewares: [
        validateAndTransformBody(MarkMessagesReadSchema),
      ],
    },
    {
      matcher: "/bugs/:id/messages*",
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
    },
    {
      matcher: "/bugs/clients/:clientId",
      methods: ["GET"],
      middlewares: [
        authenticate(["client", "user"], ["session", "bearer", "api-key"]),
      ],
    },
    {
      matcher: "/messages",
      methods: ["GET"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
    },
    {
      matcher: "/messages/unread",
      methods: ["GET"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
    },
    {
      matcher: "/bugs/:id/messages/unread",
      methods: ["GET"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
    },
    {
      methods: ["POST"],
      matcher: "/developer-reviews",
      middlewares: [
        authenticate(["client", "user"], ["session", "bearer"]),
        validateAndTransformBody(PostDeveloperReviewSchema),
      ],
    },
  ],
})