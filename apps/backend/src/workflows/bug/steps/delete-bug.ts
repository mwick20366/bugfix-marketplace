import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type DeleteBugStepInput = {
  id: string
}

export const deleteBugStep = createStep(
  "delete-bug",
  async ({ id }: DeleteBugStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)

    const originalBug = await service.retrieveBug(id)

    await service.deleteBugs(id)

    return new StepResponse(void 0, originalBug)
  },
  async (originalBug, { container }) => {
    if (!originalBug) return
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    const { client, developer, submissions, attachments, ...bugData } = originalBug
    await service.createBugs({
      ...bugData,
      client: client?.id,
      developer: developer?.id,
      submissions: submissions?.map((s) => s.id),
      attachments: attachments?.map((a) => a.id),
    })
  }
)