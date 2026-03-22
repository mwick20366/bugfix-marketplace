// src/workflows/create-bug.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type CreateBugStepInput = {
  title: string
  description: string
  techStack: string
  repoLink: string
  bounty: number
  client_id: string
}

export const createBugStep = createStep(
  "create-bug",
  async (data: CreateBugStepInput, { container }) => {
    console.log('creating bug step', data);
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    const bug = await service.createBugs(data)
    return new StepResponse(bug, bug.id)
  },
  async (bugId, { container }) => {
    console.log('creat bug failed')
    if (!bugId) return
    console.log('deleting bug step', bugId);
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    await service.deleteBugs(bugId)
  }
)