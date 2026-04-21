import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createDeveloperReviewStep } from "../developer-review/steps/create-developer-review"

// --- Types ---
export type CreateDeveloperReviewWorkflowInput = {
  rating: number
  notes?: string
  developer_id: string
  client_id: string
  submission_id: string
}

// --- Workflows ---
export const createDeveloperReviewWorkflow = createWorkflow(
  "create-developer-review",
  (input: CreateDeveloperReviewWorkflowInput) => {
    const review = createDeveloperReviewStep(input)
    return new WorkflowResponse({ review })
  }
)