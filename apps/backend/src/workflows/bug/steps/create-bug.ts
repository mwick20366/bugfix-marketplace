// src/workflows/create-bug.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type CreateBugStepInput = {
  title: string
  description: string
  tech_stack: string
  repo_link: string
  bounty: number
  client_id: string
}

export const createBugStep = createStep(
  "create-bug",
  async (data: CreateBugStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    const bug = await service.createBugs({
      ...data,
      status: "open",
    })
    return new StepResponse(bug, bug.id)
  },
  async (bugId, { container }) => {
    if (!bugId) return

    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    await service.deleteBugs(bugId)
  }
)