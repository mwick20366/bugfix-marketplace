// src/subscribers/handle-reset.ts
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function resetPasswordTokenHandler({
  event: { data: { entity_id: email, token, actor_type } },
  container,
}: SubscriberArgs<{ entity_id: string, token: string, actor_type: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const config = container.resolve("configModule")

  let urlPrefix = ""
  if (actor_type === "customer") {
    urlPrefix = config.admin.storefrontUrl || "https://storefront.com"
  } else {
    const backendUrl = config.admin.backendUrl !== "/" ? config.admin.backendUrl : "http://localhost:9000"
    urlPrefix = `${backendUrl}${config.admin.path}`
  }

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: process.env.SENDGRID_PASSWORD_RESET_TEMPLATE_ID || "",
    data: {
        reset_url: `${urlPrefix}/reset-password?token=${token}&email=${email}`,
        email,
    },
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}