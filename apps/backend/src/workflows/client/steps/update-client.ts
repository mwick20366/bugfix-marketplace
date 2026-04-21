// src/workflows/client/steps/update-client.ts
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type UpdateClientStepInput = {
  id: string
  contact_first_name?: string
  contact_last_name?: string
  company_name?: string
  avatar_url?: string
}

const updateClientStep = createStep(
  "update-client-step",
  async (input: UpdateClientStepInput, { container }) => {
    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE)

    // Store previous state for compensation
    const prevData = await bugTrackerModuleService.retrieveClient(input.id)

    const client = await bugTrackerModuleService.updateClients(input)

    return new StepResponse(client, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData) return

    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE)

    await bugTrackerModuleService.updateClients({
      id: prevData.id,
      contact_first_name: prevData.contact_first_name,
      contact_last_name: prevData.contact_last_name,
      company_name: prevData.company_name,
      avatar_url: prevData.avatar_url,
    })
  }
)

type UpdateClientWorkflowInput = {
  id: string
  contact_first_name?: string
  contact_last_name?: string
  company_name?: string
  avatar_url?: string
}

const updateClientWorkflow = createWorkflow(
  "update-client",
  function (input: UpdateClientWorkflowInput) {
    const client = updateClientStep(input)

    return new WorkflowResponse(client)
  }
)

export default updateClientWorkflow