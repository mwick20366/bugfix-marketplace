import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type RejectSubmissionStepInput = {
  submissionId: string
  client_notes?: string
}

type CompensationInput = {
  submissionId: string
}

export const rejectSubmissionStep = createStep(
  "reject-submission",
  async (data: RejectSubmissionStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)

    const originalSubmission = await service.retrieveSubmission(data.submissionId)
    const bugId = originalSubmission.bug_id

    const submission = await service.updateSubmissions({
      id: data.submissionId,
      status: "client rejected",
      client_notes: data.client_notes,
    })

    await service.updateBugs({
      id: bugId,
      status: "client rejected",
    });

    return new StepResponse(submission, {
      submissionId: submission.id,
    })
  },
  async ({ submissionId }: CompensationInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    // Undo in reverse order:
    const originalSubmission = await service.retrieveSubmission(submissionId)
    const bugId = originalSubmission.bug_id

    // 1. Revert the bug's status back to "fix submitted"
    if (bugId) {
      await service.updateBugs({
        id: bugId,
        status: "fix submitted",
      })
    }

    // 2. Revert the submission's status back to "awaiting client review"
    if (submissionId) {
      await service.updateSubmissions({
        id: submissionId,
        status: "awaiting client review",
      })
    }
  }
)