// src/api/clients/me/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import updateClientWorkflow from "../../../workflows/client/steps/update-client"
import { IN_APP_NOTIFICATION_MODULE } from "../../../modules/in-app-notification"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const clientId = req.auth_context?.actor_id

  const { data: [client] } = await query.graph({
    entity: "client",
    fields: [
      "*",
      "bugs.*",
      "bugs.developer.*",
      "bugs.submissions.*",
    ],
    filters: {
      id: clientId,
    },
  }, {
    throwIfKeyNotFound: true,
  })

  const bugs = client.bugs ?? []
  const submissions = bugs.flatMap((b: any) => b.submissions ?? [])

  const openBugs = bugs.filter((b: any) => b.status === "open").length
  const inProgress = bugs.filter((b: any) =>
    ["claimed", "fix submitted"].includes(b.status)
  ).length
  const pendingApprovals = submissions.filter(
    (s: any) => s.status === "awaiting client review"
  ).length
  const totalSpent = bugs
    .filter((b: any) => b.status === "client approved")
    .reduce((sum: number, b: any) => sum + (b.bounty ?? 0), 0)

  res.json({
    client,
    dashboard: {
      open_bugs: openBugs,
      in_progress: inProgress,
      pending_approvals: pendingApprovals,
      total_spent: totalSpent,
    },
  })
}


type RequestBody = {
  contact_first_name?: string
  contact_last_name?: string
  company_name?: string
  avatar_url?: string
}

export async function POST(
  req: AuthenticatedMedusaRequest<RequestBody>,
  res: MedusaResponse
) {
  if (!req.auth_context?.actor_id) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Not authenticated.")
  }

  const { result } = await updateClientWorkflow(req.scope).run({
    input: {
      id: req.auth_context.actor_id,
      ...req.body,
    },
  })

  res.status(200).json({ client: result })
}

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const recipientId = req.auth_context?.actor_id

  if (!recipientId) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Not authenticated.")
  }

  const notificationModuleService = req.scope.resolve(IN_APP_NOTIFICATION_MODULE)

  await notificationModuleService.deleteInAppNotifications({
    recipient_id: recipientId,
    recipient_type: "client",
  })

  res.json({ success: true })
}