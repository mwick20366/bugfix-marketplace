// src/workflows/create-developer.ts
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "@medusajs/medusa/core-flows"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type CreateDeveloperStepInput = {
  first_name: string
  last_name: string
  email: string
  avatar_url?: string  // add this
}

const createDeveloperStep = createStep(
  "create-developer-step",
  async (input: CreateDeveloperStepInput, { container }) => {
    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE)
    const developer = await bugTrackerModuleService.createDevelopers(input)

    return new StepResponse(developer, developer.id)
  },
  async (id, { container }) => {
    if (!id) return
    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE)
    await bugTrackerModuleService.deleteDevelopers(id)
  }
)

type CreateDeveloperWorkflowInput = {
  developer: CreateDeveloperStepInput
  authIdentityId: string
}

const createDeveloperWorkflow = createWorkflow(
  "create-developer",
  function (input: CreateDeveloperWorkflowInput) {
    const developer = createDeveloperStep(input.developer)

    setAuthAppMetadataStep({
      authIdentityId: input.authIdentityId,
      actorType: "developer",
      value: developer.id,
    })

    return new WorkflowResponse(developer)
  }
)

export default createDeveloperWorkflow