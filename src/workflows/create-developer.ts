// src/workflows/create-developer.ts
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "@medusajs/medusa/core-flows"
import DeveloperModuleService from "../modules/developer/service"
import { DEVELOPER_MODULE } from "../modules/developer"

type CreateDeveloperStepInput = {
  firstName: string
  lastName: string
  email: string
}

const createDeveloperStep = createStep(
  "create-developer-step",
  async (input: CreateDeveloperStepInput, { container }) => {
    const developerModuleService: DeveloperModuleService = container.resolve(DEVELOPER_MODULE)
    const developer = await developerModuleService.createDevelopers(input)
    return new StepResponse(developer, developer.id)
  },
  async (id, { container }) => {
    if (!id) return
    const developerModuleService: DeveloperModuleService = container.resolve(DEVELOPER_MODULE)
    await developerModuleService.deleteDevelopers(id)
  }
)

type CreateDeveloperWorkflowInput = {
  developer: CreateDeveloperStepInput
  authIdentityId: string
}

const createDeveloperWorkflow = createWorkflow(
  "create-developer",
  function (input: CreateDeveloperWorkflowInput) {
    // Arguments are passed when invoking the step inside the workflow
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