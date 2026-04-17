// src/modules/messaging/models/message.ts
import { model } from "@medusajs/framework/utils"

const Message = model.define("message", {
  id: model.id().primaryKey(),
  bug_id: model.text().nullable(),
  submission_id: model.text().nullable(),
  sender_type: model.enum(["client", "developer"]),
  sender_id: model.text(),
  content: model.text(),
  is_read: model.boolean().default(false),
})

export default Message