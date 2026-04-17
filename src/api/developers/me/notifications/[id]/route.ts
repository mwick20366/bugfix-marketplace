// src/api/clients/me/notifications/[id]/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IN_APP_NOTIFICATION_MODULE } from "../../../../../modules/in-app-notification"
import InAppNotificationModuleService from "../../../../../modules/in-app-notification/service"

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const notificationService: InAppNotificationModuleService = req.scope.resolve(IN_APP_NOTIFICATION_MODULE)
  const { id } = req.params

  await notificationService.updateInAppNotifications({ id, is_read: true })

  res.json({ success: true })
}

import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NOTIFICATION_MODULE } from "../../../../modules/in-app-notification"

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const recipientId = req.auth_context?.actor_id
  const { id } = req.params

  const notificationModuleService = req.scope.resolve(NOTIFICATION_MODULE)

  await notificationModuleService.deleteInAppNotifications({
    id,
    recipient_id: recipientId,
    recipient_type: "developer",
  })

  res.json({ id, deleted: true })
}
