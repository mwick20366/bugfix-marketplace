// src/workflows/create-client.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type CreateClientStepInput = {
  contactFirstName: string
  contactLastName: string
  companyName?: string
  email: string
  authIdentityId: string
}

export const createClientStep = createStep(
  "create-client",
  async (data: CreateClientStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    const client = await service.createClients(data)
    return new StepResponse(client, client.id)
  },
  async (clientId, { container }) => {
    if (!clientId) return
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    await service.deleteClients(clientId)
  }
)
