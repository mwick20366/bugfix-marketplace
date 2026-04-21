import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows"
import { BUGTRACKER_MODULE } from "../../../../modules/bugtracker"
import BugTrackerModuleService from "../../../../modules/bugtracker/service"

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params

  // 1. Resolve your service and retrieve the attachment to get the file_id
  const service: BugTrackerModuleService = req.scope.resolve(BUGTRACKER_MODULE)
  const attachment = await service.retrieveBugAttachment(id)

  if (!attachment) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Attachment with id ${id} not found`
    )
  }

  // 2. Delete the file from storage via the File Module
  await deleteFilesWorkflow(req.scope).run({
    input: { ids: [attachment.file_id] },
  })

  // 3. Delete the attachment record from your custom module
  await service.deleteBugAttachments(id)

  res.json({ deleted: id })
}