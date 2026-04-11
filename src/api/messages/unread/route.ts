// src/api/store/messages/unread/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // const { sender_id, sender_type } = req.query as {
  //   sender_id: string
  //   sender_type: "client" | "developer"
  // }

  const sender_id = req.auth_context.actor_id
  const sender_type = req.auth_context.actor_type as "client" | "developer"

  const { data: messages } = await query.graph({
    entity: "message",
    fields: ["id"],
    filters: {
      is_read: false,
      sender_type: sender_type === "client" ? "developer" : "client",
    } as any,
  })

  res.json({ unread_count: messages.length })
}