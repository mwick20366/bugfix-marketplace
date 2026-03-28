// src/workflows/create-bug.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type CreateSubmissionStepInput = {
  bug_id: string
  developer_id: string
  fileUrl: string
  notes: string
}

export const createSubmissionStep = createStep(
  "create-submission",
  async (data: CreateSubmissionStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    const submission = await service.createSubmissions(data)
    return new StepResponse(submission, submission.id)
  },
  async (submissionId, { container }) => {
    if (!submissionId) return

    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    await service.deleteSubmissions(submissionId)
  }
)