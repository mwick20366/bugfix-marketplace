// src/api/middlewares.ts
import { defineMiddlewares, authenticate,  validateAndTransformBody, validateAndTransformQuery, MedusaRequest, MedusaResponse, MedusaNextFunction, } from "@medusajs/framework/http"
import { GetBugsSchema, PostCreateBugSchema, SubmitBugFixSchema } from "./bugs/validators"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { GetSubmissionsSchema } from "./submissions/validators"
import { PostCreateSubmissionSchema, PostApproveSubmissionSchema, PostRejectSubmissionSchema } from "./submissions/validators"
import { PostCaptureSubmissionSchema } from "./submissions/[id]/finalize-approval/validators"
import { PostDeveloperReviewSchema } from "./developer-reviews/validators"
import { PostMessageSchema } from "./bugs/[id]/messages/validators"
import { MarkMessagesReadSchema } from "./bugs/[id]/messages/mark-read/validators"
import { ConfigModule } from "@medusajs/framework"
import cors from "cors"
import { parseCorsOrigins } from "@medusajs/framework/utils"
import { GetMarketplaceBugsSchema } from "./marketplace/bugs/validators"
import multer from "multer"
import { PostDeveloperSchema } from "./developers/validators"
import { PostClientSchema } from "./clients/validators"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

const corsMiddleware = (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
  const configModule: ConfigModule = req.scope.resolve("configModule")
  return cors({
    origin: parseCorsOrigins(configModule.projectConfig.http.storeCors),
    credentials: true,
  })(req, res, next)
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/developers*",
      middlewares: [corsMiddleware],
    },
    {
      matcher: "/clients*",
      middlewares: [corsMiddleware],
    },
    {
      matcher: "/submissions/*",
      middlewares: [authenticate(["client", "developer"], ["session", "bearer"])],
    },
    {
      matcher: "/clients",
      method: "POST",
      middlewares: [
        authenticate("client", ["session", "bearer"], {
          allowUnregistered: true,
        }),
        validateAndTransformBody(PostClientSchema),
      ],
    },
    {
      matcher: "/clients/me",
      method: ["GET"],
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
        validateAndTransformBody(PostDeveloperSchema),
      ],
    },
    {
      matcher: "/developers/me",
      method: ["GET"],
      middlewares: [
      authenticate("developer", ["session", "bearer"]),
      validateAndTransformQuery(createFindParams(), {
        defaults: [
          "id",
          "email",
          "first_name",
          "last_name",
          "tech_stack",
          "bugs.*", // retrieves all fields of linked bug records
          "submissions.*", // retrieves all fields of linked submission records
          "reviews.*", // retrieves all fields of linked developer review records
        ],
        isList: false,
      }),
      ],
    },
    {
      matcher: "/developers/me",
      method: "POST",
      middlewares: [
        authenticate("developer", ["bearer", "session"]),
      ],
    },
    {
      matcher: "/developers/me/notifications*",
      middlewares: [authenticate("developer", ["session", "bearer"])],
    },
    {
      matcher: "/developers/me/reviews*",
      methods: ["GET"],
      middlewares: [
        authenticate("developer", ["session", "bearer"]),
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
    // Apply CORS to all /bugs* routes
    {
      matcher: "/bugs*",
      middlewares: [corsMiddleware],
    },
    {
      method: ["POST"],
      matcher: "/bugs/attachments",
      bodyParser:  { sizeLimit: "50mb" },
      middlewares: [
        // @ts-ignore
        upload.array("files"),
      ],
    },
    {
      matcher: "/bugs/attachments/:id",
      method: ["DELETE"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
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
      method: ["GET"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
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
            "submissions.*", // retrieves all fields of linked submission records
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
      matcher: "/submissions*",
      middlewares: [corsMiddleware],
    },    
    {
      matcher: "/submissions",
      method: ["GET"],
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
      method: ["POST"],
      middlewares: [
      authenticate("client", ["session", "bearer"]),
      validateAndTransformBody(PostCreateSubmissionSchema),
      ],
    },
    {
      method: ["POST"],
      matcher: "/submissions/attachments",
      bodyParser:  { sizeLimit: "50mb" },
      middlewares: [
        // @ts-ignore
        upload.array("files"),
      ],
    },
    // Protect the messages routes — authenticated clients and developers only
    {
      matcher: "/submissions/:id/messages*",
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
    },
    {
      matcher: "/submissions/:id/messages",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostMessageSchema),
      ],
    },
    {
      matcher: "/submissions/:id/messages/mark-read",
      method: "POST",
      middlewares: [
        validateAndTransformBody(MarkMessagesReadSchema),
      ],
    },
    {
      matcher: "/submissions/:id/messages*",
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
    },
    {
      matcher: "/submissions/:id/initiate-approval",
      method: ["POST"],
      middlewares: [
        authenticate(["client"], ["session", "bearer"]),
        validateAndTransformBody(PostApproveSubmissionSchema),
      ],
    },
    {
      matcher: "/submissions/:id/finalize-approval",
      method: ["POST"],
      middlewares: [
        authenticate(["client"], ["session", "bearer"]),
        validateAndTransformBody(PostCaptureSubmissionSchema),
      ],
    },    
    {
      matcher: "/submissions/:id/reject",
      method: ["POST"],
      middlewares: [
        authenticate(["client"], ["session", "bearer"]),
        validateAndTransformBody(PostRejectSubmissionSchema),
      ],
    },
    // Only clients can create bugs
    {
      matcher: "/bugs",
      method: ["POST"],
      middlewares: [
      authenticate("client", ["session", "bearer"]),
      validateAndTransformBody(PostCreateBugSchema),
      ],
    },
    {
      matcher: "/bugs/:id",
      method: ["GET"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
        validateAndTransformQuery(createFindParams(), {
          isList: false,
          defaults: [
            "id",
            "title",
            "description",
            "tech_stack",
            "repo_link",
            "bounty",
            "difficulty",
            "status",
            "claimed_at",
            "created_at",
            "updated_at",
            "attachments.*",
            "developer.*",
            "client.*",
            "submissions.*",
          ],
        }),
      ],
    },
    // Clients OR admins can update/delete bugs
    {
      matcher: "/bugs/:id",
      method: ["POST", "DELETE"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
    },
    // Only developers can claim a bug
    {
      matcher: "/bugs/:id/claim",
      method: ["POST"],
      middlewares: [
        authenticate("developer", ["session", "bearer"]),
      ],
    },
    {
      matcher: "/bugs/:id/unclaim",
      method: "POST",
      middlewares: [
        authenticate("developer", ["bearer", "session"]),
      ],
    },
    // Only developers can submit a fix for a bug
    {
      matcher: "/bugs/:id/submit-fix",
      method: ["POST"],
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
      method: ["GET"],
      middlewares: [
        authenticate(["client", "user"], ["session", "bearer", "api-key"]),
      ],
    },
    {
      matcher: "/messages",
      method: ["GET"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
    },
    {
      matcher: "/messages/unread",
      method: ["GET"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
    },
    {
      matcher: "/bugs/:id/messages/unread",
      method: ["GET"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
      ],
    },
    {
      method: ["POST"],
      matcher: "/developer-reviews",
      middlewares: [
        authenticate(["client", "user"], ["session", "bearer"]),
        validateAndTransformBody(PostDeveloperReviewSchema),
      ],
    },
    {
      matcher: "/marketplace*",
      middlewares: [corsMiddleware],
    },
    // Query config for the bugs list
    {
      matcher: "/marketplace/bugs",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetMarketplaceBugsSchema, {
          isList: true,
          defaults: ["id", "title", "description", "tech_stack", "bounty", "difficulty", "created_at"],
        }),
      ],
    },
    {
      matcher: "/profile*",
      middlewares: [corsMiddleware],
    },
    {
      matcher: "/profile/avatar",
      method: "POST",
      middlewares: [
        authenticate(["developer", "client"], ["bearer", "session"], {
          allowUnauthenticated: true,
        }),
        // @ts-ignore
        upload.array("files"),
      ],
    },
  ],
})