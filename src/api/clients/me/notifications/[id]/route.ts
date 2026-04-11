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
