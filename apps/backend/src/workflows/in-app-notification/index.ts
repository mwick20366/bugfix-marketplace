// src/workflows/create-in-app-notification.ts
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createInAppNotificationStep, CreateInAppNotificationStepInput } from "./steps/create-in-app-notification"

export const createInAppNotificationWorkflow = createWorkflow(
  "create-in-app-notification",
  (input: CreateInAppNotificationStepInput) => {
    const notification = createInAppNotificationStep(input)
    return new WorkflowResponse({ notification })
  }
)