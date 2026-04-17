// src/api/clients/me/notifications/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const recipientId = req.auth_context?.actor_id

  const { order = "-created_at" } = req.query as { order?: string }

  // Determine sort field and direction from the order param
  const isDescending = order.startsWith("-")
  const field = isDescending ? order.slice(1) : order

  const { data: notifications } = await query.graph({
    entity: "in_app_notification",
    fields: ["*"],
    filters: {
      recipient_id: recipientId,
      recipient_type: "client",
    },
    pagination: {
      order: {
        [field]: isDescending ? "DESC" : "ASC",
      },
    },
  })

  const unread_count = notifications.filter((n: any) => !n.is_read).length

  res.json({ notifications, unread_count })
}