// src/workflows/create-client.ts
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "@medusajs/medusa/core-flows"
import { BUGTRACKER_MODULE } from "../modules/bugtracker"
import BugTrackerModuleService from "../modules/bugtracker/service"

type CreateClientStepInput = {
  contactFirstName: string
  contactLastName: string
  companyName: string
  email: string
}

const createClientStep = createStep(
  "create-client-step",
  async (input: CreateClientStepInput, { container }) => {
    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE)

    const client = await bugTrackerModuleService.createClients(input)

    return new StepResponse(client, client.id)
  },
  async (id, { container }) => {
    if (!id) return
    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE)

    await bugTrackerModuleService.deleteClients(id)
  }
)

type CreateClientWorkflowInput = {
  client: CreateClientStepInput
  authIdentityId: string
}

const createClientWorkflow = createWorkflow(
  "create-client",
  function (input: CreateClientWorkflowInput) {
    // Arguments are passed when invoking the step inside the workflow
    const client = createClientStep(input.client)

    setAuthAppMetadataStep({
      authIdentityId: input.authIdentityId,
      actorType: "client",
      value: client.id,
    })

    return new WorkflowResponse(client)
  }
)

export default createClientWorkflow