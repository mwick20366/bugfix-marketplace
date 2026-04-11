import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type SubmitBugFixStepInput = {
  bug_id: string
  developer_id: string
  notes: string
  file_url: string
}

type CompensationInput = {
  submissionId: string
  bugId: string
}

export const submitBugFixStep = createStep(
  "submit-bug-fix",
  async (data: SubmitBugFixStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    const submission = await service.createSubmissions({
      bug_id: data.bug_id,
      developer_id: data.developer_id,
      status: "awaiting client review",
      notes: data.notes,
      file_url: data.file_url,
    })

    await service.updateBugs({
      id: data.bug_id,
      status: "fix submitted",
    });

    return new StepResponse(submission, {
      submissionId: submission.id,
      bugId: data.bug_id,
    })
  },
  async (compensationData, { container }) => {
    if (!compensationData) return
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    const { submissionId, bugId } = compensationData
    // Undo in reverse order:

    // 1. Revert the bug's status back to "claimed"
    if (bugId) {
      await service.updateBugs({
        id: bugId,
        status: "claimed",
      })
    }

    // 2. Delete the created submission
    if (submissionId) {
      await service.deleteSubmissions(submissionId)
    }
  }
)