// src/modules/messaging/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Message from "./models/message"

class MessagingModuleService extends MedusaService({
  Message,
}) {}

export default MessagingModuleService