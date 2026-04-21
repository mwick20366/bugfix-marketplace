// src/api/developers/me/notifications/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { IN_APP_NOTIFICATION_MODULE } from "../../../../modules/in-app-notification"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const recipientId = req.auth_context?.actor_id

  const {
    order = "-created_at",
    limit = "15",
    offset = "0",
  } = req.query as { order?: string; limit?: string; offset?: string }

  const isDescending = order.startsWith("-")
  const field = isDescending ? order.slice(1) : order

  const {
    data: notifications,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "in_app_notification",
    fields: ["*"],
    filters: {
      recipient_id: recipientId,
      recipient_type: "developer",
    },
    pagination: {
      take: Number(limit),
      skip: Number(offset),
      order: {
        [field]: isDescending ? "DESC" : "ASC",
      },
    },
  })

  const unread_count = notifications.filter((n: any) => !n.is_read).length

  res.json({
    notifications,
    unread_count,
    count: count ?? 0,
    limit: take ?? Number(limit),
    offset: skip ?? Number(offset),
  })
}

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const recipientId = req.auth_context?.actor_id

  const notificationModuleService = req.scope.resolve(IN_APP_NOTIFICATION_MODULE)

  await notificationModuleService.deleteInAppNotifications({
    recipient_id: recipientId,
    recipient_type: "developer",
  })

  res.json({ success: true })
}