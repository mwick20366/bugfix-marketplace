// src/api/store/messages/unread/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const sender_id = req.auth_context.actor_id
  const sender_type = req.auth_context.actor_type as "client" | "developer"

  const otherParty = sender_type === "client" ? "developer" : "client"
  const ownerField = sender_type === "client" ? "client_id" : "developer_id"

  let unreadCount = 0

  // ─── Unread bug messages ───────────────────────────────────────
  const { data: userBugs } = await query.graph({
    entity: "bug",
    fields: ["id"],
    filters: {
      [ownerField]: sender_id,
      status: ["claimed", "fix submitted"],
    },
  })

  if (userBugs.length) {
    const bugIds = userBugs.map((b) => b.id)

    const { data: unreadBugMessages } = await query.graph({
      entity: "message",
      fields: ["id"],
      filters: {
        bug_id: bugIds,
        sender_type: otherParty,
        is_read: false,
      } as any,
    })

    unreadCount += unreadBugMessages.length
  }

  // ─── Unread submission messages ────────────────────────────────
  if (sender_type === "developer") {
    const { data: userSubmissions } = await query.graph({
      entity: "submission",
      fields: ["id"],
      filters: {
        developer_id: sender_id,
        status: ["awaiting client review", "client approved", "client rejected"],
      },
    })

    if (userSubmissions.length) {
      const submissionIds = userSubmissions.map((s) => s.id)

      const { data: unreadSubmissionMessages } = await query.graph({
        entity: "message",
        fields: ["id"],
        filters: {
          submission_id: submissionIds,
          sender_type: otherParty,
          is_read: false,
        } as any,
      })

      unreadCount += unreadSubmissionMessages.length
    }
  } else if (sender_type === "client") {
    const { data: clientBugs } = await query.graph({
      entity: "bug",
      fields: ["id"],
      filters: {
        client_id: sender_id,
        status: ["fix submitted"],
      },
    })

    if (clientBugs.length) {
      const clientBugIds = clientBugs.map((b) => b.id)

      const { data: clientSubmissions } = await query.graph({
        entity: "submission",
        fields: ["id"],
        filters: {
          bug_id: clientBugIds,
          status: ["awaiting client review", "client approved", "client rejected"],
        },
      })

      if (clientSubmissions.length) {
        const submissionIds = clientSubmissions.map((s) => s.id)

        const { data: unreadSubmissionMessages } = await query.graph({
          entity: "message",
          fields: ["id"],
          filters: {
            submission_id: submissionIds,
            sender_type: otherParty,
            is_read: false,
          } as any,
        })

        unreadCount += unreadSubmissionMessages.length
      }
    }
  }

  res.json({ unread_count: unreadCount })
}