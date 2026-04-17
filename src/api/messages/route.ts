// src/api/store/messages/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const sender_id = req.auth_context.actor_id
  const sender_type = req.auth_context.actor_type as "client" | "developer"

  const { unread_only } = req.query as { unread_only?: string }

  const otherParty = sender_type === "client" ? "developer" : "client"
  const ownerField = sender_type === "client" ? "client_id" : "developer_id"

  // ─── BUG THREADS ───────────────────────────────────────────────

  const { data: userBugs } = await query.graph({
    entity: "bug",
    fields: ["id"],
    filters: {
      [ownerField]: sender_id,
      status: ["claimed", "fix submitted"],
    },
  })

  let bugs: any[] = []

  if (userBugs.length) {
    const bugIds = userBugs.map((b) => b.id)

    const bugMessageFilters: Record<string, any> = {
      bug_id: bugIds,
      sender_type: otherParty,
    }

    if (unread_only === "true") {
      bugMessageFilters.is_read = false
    }

    const { data: bugMessages } = await query.graph({
      entity: "message",
      fields: ["id", "bug_id", "is_read", "created_at"],
      filters: bugMessageFilters as any,
    })

    const activeBugIds = [...new Set(bugMessages.map((m) => m.bug_id).filter((id): id is string => id != null))]

    if (activeBugIds.length) {
      const { data: bugData } = await query.graph({
        entity: "bug",
        fields: [
          "id",
          "title",
          "description",
          "tech_stack",
          "repo_link",
          "bounty",
          "difficulty",
          "status",
          "developer.first_name",
          "client.first_name",
        ],
        filters: { id: activeBugIds },
      })

      // Attach last_message_at and has_unread to each bug
      bugs = bugData.map((bug) => {
        const threadMessages = bugMessages.filter((m) => m.bug_id === bug.id)
        const last_message_at = threadMessages.reduce((latest, m) => {
          const mAt = typeof m.created_at === "string" ? m.created_at : m.created_at.toISOString()
          return mAt > latest ? mAt : latest
        }, "")
        const has_unread = threadMessages.some((m) => !m.is_read)
        return { ...bug, last_message_at, has_unread }
      })
    }
  }

  // ─── SUBMISSION THREADS ─────────────────────────────────────────

  let submissions: any[] = []

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

      const submissionMessageFilters: Record<string, any> = {
        submission_id: submissionIds,
        sender_type: otherParty,
      }

      if (unread_only === "true") {
        submissionMessageFilters.is_read = false
      }

      const { data: submissionMessages } = await query.graph({
        entity: "message",
        fields: ["id", "submission_id", "is_read", "created_at"],
        filters: submissionMessageFilters as any,
      })

      const activeSubmissionIds = [
        ...new Set(submissionMessages.map((m) => m.submission_id).filter((id): id is string => id != null)),
      ]

      if (activeSubmissionIds.length) {
        const { data: submissionData } = await query.graph({
          entity: "submission",
          fields: [
            "id",
            "notes",
            "status",
            "file_url",
            "bug.title",
            "bug.bounty",
            "developer.first_name",
          ],
          filters: { id: activeSubmissionIds },
        })

        // Attach last_message_at and has_unread to each submission
        submissions = submissionData.map((submission) => {
          const threadMessages = submissionMessages.filter((m) => m.submission_id === submission.id)
          const last_message_at = threadMessages.reduce((latest, m) => {
            const mAt = typeof m.created_at === "string" ? m.created_at : m.created_at.toISOString()
            return mAt > latest ? mAt : latest
          }, "")
          const has_unread = threadMessages.some((m) => !m.is_read)
          return { ...submission, last_message_at, has_unread }
        })
      }
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

        const submissionMessageFilters: Record<string, any> = {
          submission_id: submissionIds,
          sender_type: otherParty,
        }

        if (unread_only === "true") {
          submissionMessageFilters.is_read = false
        }

        const { data: submissionMessages } = await query.graph({
          entity: "message",
          fields: ["id", "submission_id", "is_read", "created_at"],
          filters: submissionMessageFilters as any,
        })

        const activeSubmissionIds = [
          ...new Set(submissionMessages.map((m) => m.submission_id).filter((id): id is string => id != null)),
        ]

        if (activeSubmissionIds.length) {
          const { data: submissionData } = await query.graph({
            entity: "submission",
            fields: [
              "id",
              "notes",
              "status",
              "file_url",
              "bug.title",
              "bug.bounty",
              "developer.first_name",
            ],
            filters: { id: activeSubmissionIds },
          })

          // Attach last_message_at and has_unread to each submission
          submissions = submissionData.map((submission) => {
            const threadMessages = submissionMessages.filter((m) => m.submission_id === submission.id)
            const last_message_at = threadMessages.reduce((latest, m) => {
              const mAt = typeof m.created_at === "string" ? m.created_at : m.created_at.toISOString()
              return mAt > latest ? mAt : latest
            }, "")
            const has_unread = threadMessages.some((m) => !m.is_read)
            return { ...submission, last_message_at, has_unread }
          })
        }
      }
    }
  }

  res.json({ bugs, submissions })
}