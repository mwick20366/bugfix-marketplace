import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createBugStep, CreateBugStepInput } from "./steps/create-bug"
import { updateBugStep, UpdateBugStepInput } from "./steps/update-bug"
import { deleteBugStep, DeleteBugStepInput } from "./steps/delete-bug"
import { claimBugStep } from "./steps/claim-bug"

// --- Types ---

export type CreateBugWorkflowInput = {
    bug: CreateBugStepInput
//   title: string
//   description: string
//   techStack: string
//   repoLink: string
//   bounty: number
//   client_id: string
}

export type UpdateBugWorkflowInput = {
    bug: UpdateBugStepInput
//   id: string
//   title?: string
//   description?: string
//   techStack?: string
//   repoLink?: string
//   bounty?: number
//   developer_id?: string
//   status?: string
}

export type DeleteBugWorkflowInput = {
  bug: DeleteBugStepInput
}

// --- Workflows ---

export const createBugWorkflow = createWorkflow(
  "create-bug",
  (input: CreateBugWorkflowInput) => {
    const bug = createBugStep(input.bug)
    return new WorkflowResponse(bug)
  }
)

export const updateBugWorkflow = createWorkflow(
  "update-bug",
  (input: UpdateBugWorkflowInput) => {
    const bug = updateBugStep(input.bug)
    return new WorkflowResponse(bug)
  }
)

export const deleteBugWorkflow = createWorkflow(
  "delete-bug",
  (input: DeleteBugWorkflowInput) => {
    deleteBugStep(input.bug)
    return new WorkflowResponse({})
  }
)

export const claimBugWorkflow = createWorkflow(
  "claim-bug",
  (input: { bug_id: string; developer_id: string }) => {
    const bug = claimBugStep(input)
    return new WorkflowResponse(bug)
  }
)