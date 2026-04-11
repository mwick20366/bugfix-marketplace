// src/subscribers/submission-reviewed.ts
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createInAppNotificationWorkflow } from "../workflows/in-app-notification"

export default async function submissionReviewedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; status: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [submission] } = await query.graph({
    entity: "submission",
    fields: ["id", "status", "bug.*", "developer.*"],
    filters: { id: data.id },
  })

  if (!submission?.developer?.id) return

  const isApproved = submission.status === "client approved"
  const isRejected = submission.status === "client rejected"

  if (!isApproved && !isRejected) return

  const message = isApproved
    ? `Your fix for "${submission.bug.title}" has been approved! 🎉`
    : `Your fix for "${submission.bug.title}" was rejected. Check the client's notes for details.`

  await createInAppNotificationWorkflow(container).run({
    input: {
      recipient_id: submission.developer.id,
      recipient_type: "developer",
      message,
      resource_id: submission.id,
      resource_type: "submission",
      resource_url: `/developer/account/bug-marketplace/${submission.bug.id}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "submission.updated",
}