// src/api/store/bugs/[id]/messages/unread/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id: bug_id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // sender_id of the current user — messages sent by others that are unread
  const { sender_id, sender_type } = req.query as {
    sender_id: string
    sender_type: "client" | "developer"
  }

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