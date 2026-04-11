// src/api/store/messages/route.ts
import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const sender_id = req.auth_context.actor_id  // ← from auth header
  const sender_type = req.auth_context.actor_type as "client" | "developer"

  const { unread_only } = req.query as {
    unread_only?: string
  }

  const otherParty = sender_type === "client" ? "developer" : "client"
  const ownerField = sender_type === "client" ? "client_id" : "developer_id"

  const { data: userBugs } = await query.graph({
    entity: "bug",
    fields: ["id"],
    filters: {
      [ownerField]: sender_id,
      status: ["claimed", "fix submitted"],
    },
  })

  if (!userBugs.length) return res.json({ bugs: [] })

  const bugIds = userBugs.map((b) => b.id)

  const messageFilters: Record<string, any> = {
    bug_id: bugIds,
    sender_type: otherParty,
  }

  if (unread_only === "true") {
    messageFilters.is_read = false
  }

  const { data: messages } = await query.graph({
    entity: "message",
    fields: ["id", "bug_id", "is_read", "created_at"],
    filters: messageFilters as any,
  })

  const activeBugIds = [...new Set(messages.map((m) => m.bug_id))]
  if (!activeBugIds.length) return res.json({ bugs: [] })

  const { data: bugs } = await query.graph({
    entity: "bug",
    fields: [
        "id",
        "title",
        "description",
        "tech_stack",
        "repo_link",
        "bounty",
        "difficulty",
        "status",
        "developer.first_name",
        "client.first_name",
    ],
    filters: { id: activeBugIds },
  })

  res.json({ bugs })
}