// src/workflows/create-client.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type CreateClientStepInput = {
  contact_first_name: string
  contact_last_name: string
  company_name?: string
  email: string
  authIdentityId: string
}

export const createClientStep = createStep(
  "create-client",
  async (data: CreateClientStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    console.log("Creating client with data:", data)
    const client = await service.createClients(data)
    return new StepResponse(client, client.id)
  },
  async (clientId, { container }) => {
    if (!clientId) return
    console.log("Rolling back client creation for clientId:", clientId)
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    await service.deleteClients(clientId)
  }
)
