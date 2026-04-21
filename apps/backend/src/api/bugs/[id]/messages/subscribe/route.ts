// src/api/store/bugs/[id]/messages/subscribe/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id: bug_id } = req.params

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  })

  res.write(
    "data: " + JSON.stringify({ message: "Subscribed to messages" }) + "\n\n"
  )

  const eventModuleService = req.scope.resolve(Modules.EVENT_BUS)

  const eventName = `message.created.${bug_id}`

  const handler = async (data: any) => {
    res.write("data: " + JSON.stringify(data) + "\n\n")
  }

  eventModuleService.subscribe(eventName, handler)

  req.on("close", () => {
    eventModuleService.unsubscribe(eventName, handler)
    res.end()
  })

  req.on("end", () => {
    eventModuleService.unsubscribe(eventName, handler)
    res.end()
  })
}