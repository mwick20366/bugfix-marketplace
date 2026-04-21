import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createSubmissionStep, CreateSubmissionStepInput } from "./steps/create-submission"
import { updateSubmissionStep, UpdateSubmissionStepInput } from "./steps/update-submission"
import { deleteSubmissionStep, DeleteSubmissionStepInput } from "./steps/delete-submission"
import { approveSubmissionStep, ApproveSubmissionStepInput } from "./steps/approve-submission"
import { rejectSubmissionStep, RejectSubmissionStepInput } from "./steps/reject-submission"
import { emitEventStep } from "@medusajs/medusa/core-flows"

// --- Types ---
export type CreateSubmissionWorkflowInput = {
  submission: CreateSubmissionStepInput
}

export type UpdateSubmissionWorkflowInput = {
  submission: UpdateSubmissionStepInput
}

export type DeleteSubmissionWorkflowInput = {
  submission: DeleteSubmissionStepInput
}

export type ApproveSubmissionWorkflowInput = {
  submission: ApproveSubmissionStepInput
}

export type RejectSubmissionWorkflowInput = {
  submission: RejectSubmissionStepInput
}

// --- Workflows ---

export const createSubmissionWorkflow = createWorkflow(
  "create-submission",
  (input: CreateSubmissionWorkflowInput) => {
    const submission = createSubmissionStep(input.submission)
    return new WorkflowResponse(submission)
  }
)

export const updateSubmissionWorkflow = createWorkflow(
  "update-submission",
  (input: UpdateSubmissionWorkflowInput) => {
    const submission = updateSubmissionStep(input.submission)
    return new WorkflowResponse(submission)
  }
)

export const deleteSubmissionWorkflow = createWorkflow(
  "delete-submission",
  (input: DeleteSubmissionWorkflowInput) => {
    deleteSubmissionStep(input.submission)
    return new WorkflowResponse({})
  }
)

export const approveSubmissionWorkflow = createWorkflow(
  "approve-submission",
  (input: ApproveSubmissionWorkflowInput) => {
    const submission = approveSubmissionStep(input.submission)

    emitEventStep({
      eventName: "submission.updated",
      data: {
        id: input.submission.submissionId,
      },
    })

    return new WorkflowResponse(submission)
  }
)

export const rejectSubmissionWorkflow = createWorkflow(
  "reject-submission",
  (input: RejectSubmissionWorkflowInput) => {
    const submission = rejectSubmissionStep(input.submission)

    emitEventStep({
      eventName: "submission.updated",
      data: {
        id: input.submission.submissionId,
      },
    })

    return new WorkflowResponse(submission)
  }
)
