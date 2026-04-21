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
  const { id: submission_id } = req.params
  const { content } = req.validatedBody

  const sender_id = req.auth_context.actor_id
  const sender_type = req.auth_context.actor_type as "client" | "developer"

  const messagingModuleService: MessagingModuleService =
    req.scope.resolve(MESSAGING_MODULE)

  const eventModuleService = req.scope.resolve(Modules.EVENT_BUS)

  const message = await messagingModuleService.createMessages({
    submission_id,
    sender_type,
    sender_id,
    content,
  })

  await eventModuleService.emit({
    name: `message.created.${submission_id}`,
    data: { message },
  })

  res.json({ message })
}

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id: submission_id } = req.params
  const sender_id = req.auth_context.actor_id
  const sender_type = req.auth_context.actor_type as "client" | "developer"

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: messages } = await query.graph({
    entity: "message",
    fields: ["id", "submission_id", "sender_type", "sender_id", "content", "created_at"],
    filters: {
      submission_id,
    } as any,
  })

  const messagesWithAvatars = await Promise.all(
    messages.map(async (msg) => {
      const entity = msg.sender_type as "developer" | "client"
      const fields = entity === "client" 
        ? ["id", "avatar_url", "contact_first_name", "contact_last_name"]
        : ["id", "avatar_url", "first_name", "last_name"]
      const { data: senders } = await query.graph({
        entity,
        fields,
        filters: { id: msg.sender_id },
      })
      const sender = senders[0]
      const firstName = entity === "client" 
        ? (sender as any)?.contact_first_name ?? null
        : (sender as any)?.first_name ?? null
      const lastName = entity === "client"
        ? (sender as any)?.contact_last_name ?? null
        : (sender as any)?.last_name ?? null
      return {
        ...msg,
        sender_avatar_url: sender?.avatar_url ?? null,
        sender_first_name: firstName,
        sender_last_name: lastName,
      }
    })
  )

  res.json({ messages: messagesWithAvatars })
}