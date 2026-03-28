import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import BugTrackerModuleService from "../../../modules/bugtracker/service"
import { Submission } from "../../../../.medusa/types/query-entry-points"
import { CreateSubmissionStepInput } from "./create-submission"

export type DeleteSubmissionStepInput = {
  id: string
}

export const deleteSubmissionStep = createStep(
  "delete-submission",
  async ({ id }: DeleteSubmissionStepInput, { container }) => {
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)

    const originalSubmission = await service.retrieveSubmission(id) as Submission

    await service.deleteSubmissions(id)

    return new StepResponse(void 0, originalSubmission)
  },
  async (originalSubmission, { container }) => {
    if (!originalSubmission) return
    const service: BugTrackerModuleService = container.resolve(BUGTRACKER_MODULE)
    await service.createSubmissions(originalSubmission as CreateSubmissionStepInput)
  }
)