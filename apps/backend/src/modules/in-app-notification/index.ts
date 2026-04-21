// src/modules/in-app-notification/index.ts
import InAppNotificationModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const IN_APP_NOTIFICATION_MODULE = "inAppNotification"

export default Module(IN_APP_NOTIFICATION_MODULE, {
  service: InAppNotificationModuleService,
})