import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createBugStep, CreateBugStepInput } from "./steps/create-bug"
import { updateBugStep, UpdateBugStepInput } from "./steps/update-bug"
import { deleteBugStep, DeleteBugStepInput } from "./steps/delete-bug"
import { claimBugStep } from "./steps/claim-bug"
import { submitBugFixStep, SubmitBugFixStepInput } from "./steps/submit-bug-fix"

// --- Types ---

export type CreateBugWorkflowInput = {
  bug: CreateBugStepInput
}

export type UpdateBugWorkflowInput = {
  bug: UpdateBugStepInput
}

export type SubmitBugFixWorkflowInput = {
  submission: SubmitBugFixStepInput,
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

export const submitBugFixWorkflow = createWorkflow(
  "submit-bug-fix",
  (input: SubmitBugFixWorkflowInput) =>
  {
    const bug = submitBugFixStep(input.submission)
    return new WorkflowResponse(bug)
  }
)