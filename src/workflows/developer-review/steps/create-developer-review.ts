import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"

export type CreateDeveloperReviewStepInput = {
  rating: number
  notes?: string
  developer_id: string
  client_id: string
  submission_id: string
}

export const createDeveloperReviewStep = createStep(
  "create-developer-review",
  async (input: CreateDeveloperReviewStepInput, { container }) => {
    const reviewService: BugTrackerModuleService = container.resolve(
      BUGTRACKER_MODULE
    )

    const review = await reviewService.createDeveloperReviews(input)

    return new StepResponse(review, review.id)
  },
  async (reviewId, { container }) => {
    if (!reviewId) return

    const reviewService: BugTrackerModuleService = container.resolve(
      BUGTRACKER_MODULE
    )

    await reviewService.deleteDeveloperReviews(reviewId)
  }
)