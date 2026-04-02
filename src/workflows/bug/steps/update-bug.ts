import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type UpdateBugStepInput = {
  id: string
  title?: string
  description?: string
  tech_stack?: string
  repo_link?: string
  bounty?: number
  developer_id?: string
  status?: string
}

export const updateBugStep = createStep(
  "update-bug",
  async (data: UpdateBugStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)

    const originalBug = await service.retrieveBug(data.id)

    const bug = await service.updateBugs(data)

    return new StepResponse(bug, originalBug)
  },
  async (originalBug, { container }) => {
    if (!originalBug) return
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    const { client, developer, ...bugData } = originalBug
    await service.createBugs({
      ...bugData,
      client: client?.id,
      developer: developer?.id,
    })
  }
)