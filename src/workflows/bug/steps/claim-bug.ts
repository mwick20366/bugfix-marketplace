import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type ClaimBugStepInput = {
  bug_id: string
  developer_id: string
}

export const claimBugStep = createStep(
  "claim-bug",
  async (data: ClaimBugStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)

    const originalBug = await service.retrieveBug(data.bug_id)

    const bug = await service.updateBugs({
      id: data.bug_id,
      developer_id: data.developer_id,
      status: "claimed",
    })

    return new StepResponse(bug, originalBug)
  },
  async (originalBug, { container }) => {
    if (!originalBug) return
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    await service.updateBugs({
      id: originalBug.id,
      developer_id: originalBug.developer_id,
      status: originalBug.status,
    })
  }
)