import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"
import { BUGTRACKER_MODULE } from "../../../../modules/bugtracker"
import BugTrackerModuleService from "../../../../modules/bugtracker/service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const files = req.files as Express.Multer.File[]
  const { id: submission_id } = req.params

  if (!files?.length) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "No files were uploaded")
  }

  const { result } = await uploadFilesWorkflow(req.scope).run({
    input: {
      files: files.map((f) => ({
        filename: f.originalname,
        mimeType: f.mimetype,
        content: f.buffer.toString("base64"),
        access: "public",
      })),
    },
  })

  const service: BugTrackerModuleService = req.scope.resolve(BUGTRACKER_MODULE)

  const attachments = await service.createSubmissionAttachments(
    result.map((f, index) => ({
      file_id: f.id,
      file_url: f.url,
      filename: files[index].originalname,
      submission_id,
    }))
  )

  res.status(200).json({ files: result, attachments })
}