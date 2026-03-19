// src/workflows/create-bug.ts
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "@medusajs/medusa/core-flows"
import BugModuleService from "../modules/bug/service"
import { BUG_MODULE } from "../modules/bug"

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
    const bugModuleService: BugModuleService = container.resolve(BUG_MODULE)
    const bug = await bugModuleService.createBugs(input)
    return new StepResponse(bug, bug.id)
  },
  async (id, { container }) => {
    if (!id) return
    const bugModuleService: BugModuleService = container.resolve(BUG_MODULE)
    await bugModuleService.deleteBugs(id)
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