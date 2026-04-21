// src/workflows/steps/create-in-app-notification.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { IN_APP_NOTIFICATION_MODULE } from "../../../modules/in-app-notification"
import InAppNotificationModuleService from "../../../modules/in-app-notification/service"

export type CreateInAppNotificationStepInput = {
  recipient_id: string
  recipient_type: "client" | "developer"
  message: string
  resource_id?: string
  resource_type?: string
  resource_url?: string
}

export const createInAppNotificationStep = createStep(
  "create-in-app-notification",
  async (input: CreateInAppNotificationStepInput, { container }) => {
    const notificationService: InAppNotificationModuleService = container.resolve(
      IN_APP_NOTIFICATION_MODULE
    )

    const notification = await notificationService.createInAppNotifications(input)

    return new StepResponse(notification, notification.id)
  },
  async (notificationId, { container }) => {
    if (!notificationId) return

    const notificationService: InAppNotificationModuleService = container.resolve(
      IN_APP_NOTIFICATION_MODULE
    )

    await notificationService.deleteInAppNotifications(notificationId)
  }
)