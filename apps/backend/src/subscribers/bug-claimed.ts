// src/subscribers/bug-claimed.ts
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createInAppNotificationWorkflow } from "../workflows/in-app-notification"

export default async function bugClaimedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  const { data: [bug] } = await query.graph({
    entity: "bug",
    fields: ["id", "title", "client.*", "developer.*"],
    filters: { id: data.id },
  })

  if (!bug?.client?.id) return

  // In-app notification (existing)
  await createInAppNotificationWorkflow(container).run({
    input: {
      recipient_id: bug.client.id,
      recipient_type: "client",
      message: `A developer has claimed your bug: "${bug.title}"`,
      resource_id: bug.id,
      resource_type: "bug",
      resource_url: `/client/account/bugs/${bug.id}`,
    },
  })

  // Email notification via SendGrid
  if (bug.client.email) {
    await notificationModuleService.createNotifications({
      to: bug.client.email,
      channel: "email",
      template: process.env.SENDGRID_BUG_CLAIMED_TEMPLATE_ID || "",
      data: {
        bug_title: bug.title,
        developer_name: bug.developer?.first_name,
        bug_url: `https://yoursite.com/client/account/bugs/${bug.id}`,
      },
    })
  }
}

export const config: SubscriberConfig = {
  event: "bug.claimed",
}