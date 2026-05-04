// src/workflows/developer/steps/update-developer.ts
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker";
import BugTrackerModuleService from "../../../modules/bugtracker/service";

// src/workflows/developer/steps/update-developer.ts

export type UpdateDeveloperStepInput = {
  id: string;
  first_name?: string;
  last_name?: string;
  tech_stack?: string;
  avatar_url?: string;
  stripe_account_id?: string;
  is_payout_ready?: boolean; // Include this if you want to update payout readiness in the same step
};

const updateDeveloperStep = createStep(
  "update-developer-step",
  async (input: UpdateDeveloperStepInput, { container }) => {
    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE);

    const prevData = await bugTrackerModuleService.retrieveDeveloper(input.id);
    const developer = await bugTrackerModuleService.updateDevelopers(input);

    return new StepResponse(developer, prevData);
  },
  async (prevData, { container }) => {
    if (!prevData) return;
    const bugTrackerModuleService: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE);

    // Ensure the rollback includes the stripe_account_id
    await bugTrackerModuleService.updateDevelopers({
      id: prevData.id,
      first_name: prevData.first_name,
      last_name: prevData.last_name,
      avatar_url: prevData.avatar_url,
      tech_stack: prevData.tech_stack,
      stripe_account_id: prevData.stripe_account_id,
    });
  },
);

type UpdateDeveloperWorkflowInput = {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  tech_stack?: string;
  stripe_account_id?: string;
  is_payout_ready?: boolean; // Include this if you want to update payout readiness in the same workflow
};

const updateDeveloperWorkflow = createWorkflow(
  "update-developer",
  function (input: UpdateDeveloperWorkflowInput) {
    const developer = updateDeveloperStep(input);

    return new WorkflowResponse(developer);
  },
);

export default updateDeveloperWorkflow;
