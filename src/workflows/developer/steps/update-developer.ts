// src/workflows/developer/steps/update-developer.ts
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type UpdateDeveloperStepInput = {
  id: string
  first_name?: string
  last_name?: string
  avatar_url?: string
}

const updateDeveloperStep = createStep(
  "update-developer-step",
  async (input: UpdateDeveloperStepInput, { container }) => {
    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE)

    // Store previous state for compensation
    const prevData = await bugTrackerModuleService.retrieveDeveloper(input.id)

    const developer = await bugTrackerModuleService.updateDevelopers(input)

    return new StepResponse(developer, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData) return

    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE)

    await bugTrackerModuleService.updateDevelopers({
      id: prevData.id,
      first_name: prevData.first_name,
      last_name: prevData.last_name,
      avatar_url: prevData.avatar_url,
    })
  }
)

type UpdateDeveloperWorkflowInput = {
  id: string
  first_name?: string
  last_name?: string
  avatar_url?: string
}

const updateDeveloperWorkflow = createWorkflow(
  "update-developer",
  function (input: UpdateDeveloperWorkflowInput) {
    const developer = updateDeveloperStep(input)

    return new WorkflowResponse(developer)
  }
)

export default updateDeveloperWorkflow