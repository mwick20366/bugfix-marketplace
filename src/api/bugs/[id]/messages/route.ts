// src/api/store/bugs/[id]/messages/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { MESSAGING_MODULE } from "../../../../modules/messaging"
import MessagingModuleService from "../../../../modules/messaging/service"

type PostMessageBody = {
  sender_type: "client" | "developer"
  sender_id: string
  content: string
}

export const POST = async (
  req: MedusaRequest<PostMessageBody>,
  res: MedusaResponse
) => {
  const { id: bug_id } = req.params
  const { sender_type, sender_id, content } = req.validatedBody

  const messagingModuleService: MessagingModuleService =
    req.scope.resolve(MESSAGING_MODULE)

  const eventModuleService = req.scope.resolve(Modules.EVENT_BUS)

  const message = await messagingModuleService.createMessages({
    bug_id,
    sender_type,
    sender_id,
    content,
  })

  await eventModuleService.emit({
    name: `message.created.${bug_id}`,
    data: { message },
  })

  res.json({ message })
}

// export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
//   const { id: bug_id } = req.params
//   const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

//   const { data: messages } = await query.graph({
//     entity: "message",
//     fields: ["id", "bug_id", "sender_type", "sender_id", "content", "created_at"],
//     filters: { bug_id },
//   })

//   res.json({ messages })
// }