import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "@medusajs/medusa/core-flows"
import { createClientStep, CreateClientStepInput } from "./steps/create-client"
// import { updateClientStep } from "./steps/update-client"
// import { deleteClientStep } from "./steps/delete-client"

// --- Types ---

// export type UpdateClientWorkflowInput = {
//   id: string
//   developer_id?: string
//   status?: string
// }

// export type DeleteClientWorkflowInput = {
//   id: string
// }

export type CreateClientWorkflowInput = {
  client: CreateClientStepInput
  authIdentityId: string
}

// --- Workflows ---

export const createClientWorkflow = createWorkflow(
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

// export const updateClientWorkflow = createWorkflow(
//   "update-client",
//   (input: UpdateClientWorkflowInput) => {
//     const client = updateClientStep(input)
//     return new WorkflowResponse(client)
//   }
// )

// export const deleteClientWorkflow = createWorkflow(
//   "delete-client",
//   (input: DeleteClientWorkflowInput) => {
//     deleteClientStep(input)
//     return new WorkflowResponse({})
//   }
// )