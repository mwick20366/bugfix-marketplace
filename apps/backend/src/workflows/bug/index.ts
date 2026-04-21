import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createBugStep, CreateBugStepInput } from "./steps/create-bug"
import { updateBugStep, UpdateBugStepInput } from "./steps/update-bug"
import { deleteBugStep, DeleteBugStepInput } from "./steps/delete-bug"
import { claimBugStep } from "./steps/claim-bug"
import { unClaimBugStep } from "./steps/unclaim-bug"
import { submitBugFixStep, SubmitBugFixStepInput } from "./steps/submit-bug-fix"
import { emitEventStep } from "@medusajs/medusa/core-flows"

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

    emitEventStep({
      eventName: "bug.claimed",
      data: { id: input.bug_id },
    })

    return new WorkflowResponse(bug)
  }
)

export const unClaimBugWorkflow = createWorkflow(
  "unclaim-bug",
  (input: { bug_id: string; developer_id: string }) => {
    const bug = unClaimBugStep(input)

    emitEventStep({
      eventName: "bug.unclaimed",
      data: { id: input.bug_id },
    })

    return new WorkflowResponse(bug)
  }
)

export const submitBugFixWorkflow = createWorkflow(
  "submit-bug-fix",
  (input: SubmitBugFixWorkflowInput) =>
  {
    const submission = submitBugFixStep(input.submission)

    emitEventStep({
      eventName: "submission.created",
      data: { id: submission.id },
    })

    return new WorkflowResponse(submission)
  }
)