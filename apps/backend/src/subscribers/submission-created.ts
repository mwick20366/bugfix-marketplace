// src/subscribers/submission-created.ts
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createInAppNotificationWorkflow } from "../workflows/in-app-notification"

export default async function submissionCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [submission] } = await query.graph({
    entity: "submission",
    fields: ["id", "bug.*", "bug.client.*", "developer.*"],
    filters: { id: data.id },
  })

  if (!submission?.bug?.client?.id) return

  await createInAppNotificationWorkflow(container).run({
    input: {
      recipient_id: submission.bug.client.id,
      recipient_type: "client",
      message: `A fix has been submitted for your bug: "${submission.bug.title}"`,
      resource_id: submission.id,
      resource_type: "submission",
      resource_url: `/client/account/bugs/${submission.bug.id}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "submission.created",
}