// src/api/store/submissions/[id]/messages/mark-read/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MESSAGING_MODULE } from "../../../../../modules/messaging"
import MessagingModuleService from "../../../../../modules/messaging/service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id: submission_id } = req.params
  const { reader_type } = req.validatedBody as { reader_type: "client" | "developer" }

  const messagingModuleService: MessagingModuleService =
    req.scope.resolve(MESSAGING_MODULE)

  // Mark all messages sent by the OTHER party as read
  const sender_type = reader_type === "client" ? "developer" : "client"

  await messagingModuleService.updateMessages({
    selector: {
      submission_id,
      sender_type,
      is_read: false,
    },
    data: {
      is_read: true,
    },
  })

  res.json({ success: true })
}