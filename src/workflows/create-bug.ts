// src/workflows/create-bug.ts
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "@medusajs/medusa/core-flows"
import { BUGTRACKER_MODULE } from "../modules/bugtracker"
import BugTrackerModuleService from "../modules/bugtracker/service"

type CreateBugStepInput = {
  clientId: string
  title: string
  description: string
  techStack: string
  repoLink: string
  bounty: number
}

const createBugStep = createStep(
  "create-bug-step",
  async (input: CreateBugStepInput, { container }) => {
    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE)
      
    const bug = await bugTrackerModuleService.createBugs(input)
    return new StepResponse(bug, bug.id)
  },
  async (id, { container }) => {
    if (!id) return
    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE)
      
    await bugTrackerModuleService.deleteBugs(id)
  }
)

type CreateBugWorkflowInput = {
  bug: CreateBugStepInput
  authIdentityId: string
}

const createBugWorkflow = createWorkflow(
  "create-bug",
  function (input: CreateBugWorkflowInput) {
    // Arguments are passed when invoking the step inside the workflow
    const bug = createBugStep(input.bug)

    setAuthAppMetadataStep({
      authIdentityId: input.authIdentityId,
      actorType: "bug",
      value: bug.id,
    })

    return new WorkflowResponse(bug)
  }
)

export default createBugWorkflow