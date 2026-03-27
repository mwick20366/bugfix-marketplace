import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type SubmitBugFixStepInput = {
  bug_id: string
  developer_id: string
  notes: string
  fileUrl: string
}

type CompensationInput = {
  submissionId: string
  bugId: string
}

export const submitBugFixStep = createStep(
  "submit-bug-fix",
  async (data: SubmitBugFixStepInput, { container }) => {
    console.log("Submitting bug fix with data:", data)
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    const submission = await service.createSubmissions({
      bug_id: data.bug_id,
      developer_id: data.developer_id,
      status: "awaiting client review",
      notes: data.notes,
      fileUrl: data.fileUrl,
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
  async ({ submissionId, bugId }: CompensationInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
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