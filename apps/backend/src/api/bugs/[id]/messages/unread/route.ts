// src/api/store/bugs/[id]/messages/unread/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id: bug_id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const sender_id = req.auth_context.actor_id
  const sender_type = req.auth_context.actor_type as "client" | "developer"

  const { data: messages } = await query.graph({
    entity: "message",
    fields: ["id"],
    filters: {
      bug_id,
      is_read: false,
      sender_type: sender_type === "client" ? "developer" : "client",
    } as any,
  })

  res.json({ unread_count: messages.length })
}