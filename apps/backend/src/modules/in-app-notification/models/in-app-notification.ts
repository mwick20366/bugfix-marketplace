// src/modules/in-app-notification/models/in-app-notification.ts
import { model } from "@medusajs/framework/utils"

const InAppNotification = model.define("in_app_notification", {
  id: model.id().primaryKey(),
  recipient_id: model.text().index("IDX_IN_APP_NOTIFICATION_RECIPIENT"),
  recipient_type: model.text(),
  message: model.text(),
  resource_id: model.text().nullable(),
  resource_type: model.text().nullable(),
  resource_url: model.text().nullable(),
  is_read: model.boolean().default(false),
})

export default InAppNotification