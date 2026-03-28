import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"
import { CreateSubmissionStepInput } from "./create-submission"

export type UpdateSubmissionStepInput = {
  id: string
  bug_id?: string
  developer_id?: string
  fileUrl?: string
  notes?: string
}

export const updateSubmissionStep = createStep(
  "update-submission",
  async (data: UpdateSubmissionStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)

    const originalSubmission = await service.retrieveSubmission(data.id)

    const submission = await service.updateSubmissions(data)

    return new StepResponse(submission, originalSubmission)
  },
  async (originalSubmission, { container }) => {
    if (!originalSubmission) return
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    const { developer, ...submissionData } = originalSubmission
    await service.createSubmissions({
      ...submissionData,
    } as CreateSubmissionStepInput)
  }
)