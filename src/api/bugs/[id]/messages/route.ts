// src/api/bugs/[id]/messages/route.ts
import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { MESSAGING_MODULE } from "../../../../modules/messaging"
import MessagingModuleService from "../../../../modules/messaging/service"

type PostMessageBody = {
  content: string
}

export const POST = async (
  req: AuthenticatedMedusaRequest<PostMessageBody>,
  res: MedusaResponse
) => {
  const { id: bug_id } = req.params
  const { content } = req.validatedBody

  const sender_id = req.auth_context.actor_id
  const sender_type = req.auth_context.actor_type as "client" | "developer"

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

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id: bug_id } = req.params
  const sender_id = req.auth_context.actor_id
  const sender_type = req.auth_context.actor_type as "client" | "developer"

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: messages } = await query.graph({
    entity: "message",
    fields: ["id", "bug_id", "sender_type", "sender_id", "content", "created_at"],
    filters: {
      bug_id,
      // sender_id,
      // sender_type,
    } as any,
  })

  res.json({ messages })
}