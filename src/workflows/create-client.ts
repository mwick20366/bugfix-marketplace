// src/workflows/create-client.ts
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "@medusajs/medusa/core-flows"
import ClientModuleService from "../modules/client/service"
import { CLIENT_MODULE } from "../modules/client"

type CreateClientStepInput = {
  contactFirstName: string
  contactLastName: string
  companyName: string
  email: string
}

const createClientStep = createStep(
  "create-client-step",
  async (input: CreateClientStepInput, { container }) => {
    const clientModuleService: ClientModuleService = container.resolve(CLIENT_MODULE)
    const client = await clientModuleService.createClients(input)
    return new StepResponse(client, client.id)
  },
  async (id, { container }) => {
    if (!id) return
    const clientModuleService: ClientModuleService = container.resolve(CLIENT_MODULE)
    await clientModuleService.deleteClients(id)
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