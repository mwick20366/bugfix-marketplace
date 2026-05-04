// src/api/middlewares.ts
import { 
  defineMiddlewares, 
  authenticate, 
  validateAndTransformBody, 
  validateAndTransformQuery, 
  MedusaRequest, 
  MedusaResponse, 
  MedusaNextFunction 
} from "@medusajs/framework/http"
import { ConfigModule } from "@medusajs/framework"
import { parseCorsOrigins } from "@medusajs/framework/utils"
import cors from "cors"
import multer from "multer"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

// Validators
import { GetBugsSchema, PostCreateBugSchema, SubmitBugFixSchema } from "./bugs/validators"
import { GetSubmissionsSchema, PostCreateSubmissionSchema, PostApproveSubmissionSchema, PostRejectSubmissionSchema } from "./submissions/validators"
import { PostCaptureSubmissionSchema } from "./submissions/[id]/finalize-approval/validators"
import { PostDeveloperReviewSchema } from "./developer-reviews/validators"
import { PostMessageSchema } from "./bugs/[id]/messages/validators"
import { MarkMessagesReadSchema } from "./bugs/[id]/messages/mark-read/validators"
import { GetMarketplaceBugsSchema } from "./marketplace/bugs/validators"
import { PostDeveloperSchema } from "./developers/validators"
import { PostClientSchema } from "./clients/validators"

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

const corsMiddleware = (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
  const configModule: ConfigModule = req.scope.resolve("configModule")
  return cors({ 
    origin: parseCorsOrigins(configModule.projectConfig.http.storeCors), 
    credentials: true 
  })(req, res, next)
}

export default defineMiddlewares({
  routes: [
    /**
     * GLOBAL CORS HANDLERS
     * We apply CORS to every custom root prefix FIRST.
     * This prevents "pre-flight" OPTIONS requests from hitting 401s.
     */
    { matcher: "/developers*", middlewares: [corsMiddleware] },
    { matcher: "/clients*", middlewares: [corsMiddleware] },
    { matcher: "/bugs*", middlewares: [corsMiddleware] },
    { matcher: "/submissions*", middlewares: [corsMiddleware] },
    { matcher: "/marketplace*", middlewares: [corsMiddleware] },
    { matcher: "/profile*", middlewares: [corsMiddleware] },
    { matcher: "/messages*", middlewares: [corsMiddleware] },
    {
      matcher: "/hooks*",
      middlewares: [], // Explicitly leave this empty to bypass all auth/cors for webhooks
    },
    /**
     * CLIENTS
     */
    {
      matcher: "/clients",
      method: "POST",
      middlewares: [
        authenticate("client", ["session", "bearer"], { allowUnregistered: true }),
        validateAndTransformBody(PostClientSchema),
      ],
    },
    {
      matcher: "/clients/me",
      method: ["GET"],
      middlewares: [
        authenticate("client", ["session", "bearer"]),
        validateAndTransformQuery(createFindParams(), {
          defaults: ["id", "email", "company_name", "contact_first_name", "contact_last_name", "bugs.*", "submissions.*"],
          isList: false,
        }),
      ],
    },
    { matcher: "/clients/me/notifications*", middlewares: [authenticate("client", ["session", "bearer"])] },
    { matcher: "/clients/*", middlewares: [authenticate("client", ["session", "bearer"])] },

    /**
     * DEVELOPERS
     */
    {
      matcher: "/developers",
      method: "POST",
      middlewares: [
        authenticate("developer", ["session", "bearer"], { allowUnregistered: true }),
        validateAndTransformBody(PostDeveloperSchema),
      ],
    },
    {
      matcher: "/developers/me",
      method: ["GET"],
      middlewares: [
        authenticate("developer", ["session", "bearer"]),
        validateAndTransformQuery(createFindParams(), {
          defaults: ["id", "email", "first_name", "last_name", "tech_stack", "bugs.*", "submissions.*", "reviews.*"],
          isList: false,
        }),
      ],
    },
    { matcher: "/developers/me/notifications*", middlewares: [authenticate("developer", ["session", "bearer"])] },
    { matcher: "/developers/me/onboarding", method: "POST", middlewares: [authenticate("developer", ["session", "bearer"])] },
    { matcher: "/developers/*", middlewares: [authenticate("developer", ["session", "bearer"])] },

    /**
     * BUGS
     */
    {
      matcher: "/bugs",
      method: ["GET"],
      middlewares: [
        authenticate(["client", "developer"], ["session", "bearer"]),
        validateAndTransformQuery(GetBugsSchema, {
          isList: true,
          defaults: ["id", "title", "description", "tech_stack", "repo_link", "bounty", "difficulty", "status", "created_at", "updated_at", "claimed_at", "developer.*", "submissions.*", "client.id", "client.company_name"],
          defaultLimit: 15,
        }),
      ],
    },
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
          defaults: ["id", "title", "description", "tech_stack", "repo_link", "bounty", "difficulty", "status", "claimed_at", "created_at", "updated_at", "attachments.*", "developer.*", "client.*", "submissions.*"],
        }),
      ],
    },
    { matcher: "/bugs/:id", method: ["POST", "DELETE"], middlewares: [authenticate(["client", "developer"], ["session", "bearer"])] },
    { matcher: "/bugs/:id/claim", method: ["POST"], middlewares: [authenticate("developer", ["session", "bearer"])] },
    { matcher: "/bugs/:id/unclaim", method: "POST", middlewares: [authenticate("developer", ["session", "bearer"])] },
    { matcher: "/bugs/:id/submit-fix", method: ["POST"], middlewares: [authenticate("developer", ["session", "bearer"]), validateAndTransformBody(SubmitBugFixSchema)] },
    { matcher: "/bugs/attachments", method: ["POST"], bodyParser: { sizeLimit: "50mb" }, middlewares: [upload.array("files")] },
    { matcher: "/bugs/attachments/:id", method: ["DELETE"], middlewares: [authenticate(["client", "developer"], ["session", "bearer"])] },
    
    // Bug Messaging
    { matcher: "/bugs/:id/messages*", middlewares: [authenticate(["client", "developer"], ["session", "bearer"])] },
    { matcher: "/bugs/:id/messages", method: "POST", middlewares: [validateAndTransformBody(PostMessageSchema)] },
    { matcher: "/bugs/:id/messages/mark-read", method: "POST", middlewares: [validateAndTransformBody(MarkMessagesReadSchema)] },

    /**
     * SUBMISSIONS
     */
    { matcher: "/submissions*", middlewares: [authenticate(["client", "developer"], ["session", "bearer"])] },
    {
      matcher: "/submissions",
      method: ["GET"],
      middlewares: [
        authenticate(["client", "developer", "user"], ["session", "bearer"]),
        validateAndTransformQuery(GetSubmissionsSchema, {
          isList: true,
          defaults: ["id", "notes", "file_url", "status", "created_at", "updated_at", "client_notes", "bug.*", "bug.developer.*", "bug.client.*"],
          defaultLimit: 15,
        }),
      ],
    },
    {
      matcher: "/submissions",
      method: ["POST"],
      middlewares: [
        authenticate("developer", ["session", "bearer"]), // Logic Fix: Developers submit fixes, not clients
        validateAndTransformBody(PostCreateSubmissionSchema),
      ],
    },
    { matcher: "/submissions/:id", method: ["POST", "DELETE"], middlewares: [authenticate(["client", "developer"], ["session", "bearer"])] },
    { matcher: "/submissions/:id/initiate-approval", method: ["POST"], middlewares: [authenticate("client", ["session", "bearer"]), validateAndTransformBody(PostApproveSubmissionSchema)] },
    { matcher: "/submissions/:id/finalize-approval", method: ["POST"], middlewares: [authenticate("client", ["session", "bearer"]), validateAndTransformBody(PostCaptureSubmissionSchema)] },
    { matcher: "/submissions/:id/reject", method: ["POST"], middlewares: [authenticate("client", ["session", "bearer"]), validateAndTransformBody(PostRejectSubmissionSchema)] },
    { matcher: "/submissions/attachments", method: ["POST"], bodyParser: { sizeLimit: "50mb" }, middlewares: [upload.array("files")] },
        
    // Submission Messaging
    { matcher: "/submissions/:id/messages*", middlewares: [authenticate(["client", "developer"], ["session", "bearer"])] },
    { matcher: "/submissions/:id/messages", method: "POST", middlewares: [validateAndTransformBody(PostMessageSchema)] },
    { matcher: "/submissions/:id/messages/mark-read", method: "POST", middlewares: [validateAndTransformBody(MarkMessagesReadSchema)] },

    /**
     * MARKETPLACE & PROFILE
     */
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
    { matcher: "/messages*", middlewares: [authenticate(["client", "developer"], ["session", "bearer"])] },
    { matcher: "/developer-reviews", method: ["POST"], middlewares: [authenticate(["client", "user"], ["session", "bearer"]), validateAndTransformBody(PostDeveloperReviewSchema)] },
    { matcher: "/profile/avatar", method: "POST", middlewares: [upload.array("files")] },
  ],
})
