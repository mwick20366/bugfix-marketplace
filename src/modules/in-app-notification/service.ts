// src/modules/in-app-notification/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import InAppNotification from "./models/in-app-notification"

class InAppNotificationModuleService extends MedusaService({
  InAppNotification,
}) {}

export default InAppNotificationModuleService
