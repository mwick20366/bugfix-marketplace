import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import updateDeveloperWorkflow from "../../../workflows/developer/steps/update-developer"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const developerId = req.auth_context?.actor_id

  const { data: [developer] } = await query.graph({
    entity: "developer",
    fields: ["*", "bugs.*", "submissions.*", "submissions.bug.*", "reviews.*"],
    filters: {
      id: developerId,
    },
  }, {
    throwIfKeyNotFound: true,
  })

  // Fetch all open bugs across the entire platform
  const { metadata: { count: availableBugs } = { count: 0 } } = await query.graph({
    entity: "bug",
    fields: ["id"],
    filters: { status: "open" },
    pagination: { take: 0, skip: 0 },
  })

  const bugs = developer.bugs ?? []
  const submissions = developer.submissions ?? []

  const activeClaims = bugs.filter((b: any) => b.status === "claimed").length
  const pendingReview = submissions.filter(
    (s: any) => s.status === "awaiting client review"
  ).length
  const totalEarned = submissions
    .filter((s: any) => s.status === "client approved")
    .reduce((sum: number, s: any) => sum + (s.bug?.bounty ?? 0), 0)

  res.json({
    developer,
    dashboard: {
      available_bugs: availableBugs,
      active_claims: activeClaims,
      pending_review: pendingReview,
      total_earned: totalEarned,
    },
  })
}

type RequestBody = {
  first_name?: string
  last_name?: string
  avatar_url?: string
}

export async function POST(
  req: AuthenticatedMedusaRequest<RequestBody>,
  res: MedusaResponse
) {
  if (!req.auth_context?.actor_id) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Not authenticated.")
  }

  const { result } = await updateDeveloperWorkflow(req.scope).run({
    input: {
      id: req.auth_context.actor_id,
      ...req.body,
    },
  })

  res.status(200).json({ developer: result })
}