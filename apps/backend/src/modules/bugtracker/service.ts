// src/modules/client/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Client from "./models/client"
import Developer from "./models/developer"
import Bug from "./models/bug"
import Submission from "./models/submission"
import DeveloperReview from "./models/developer-review"
import BugAttachment from "./models/bug-attachment"
import SubmissionAttachment from "./models/submission-attachment"

class BugTrackerModuleService extends MedusaService({
  Client,
  Developer,
  Bug,
  Submission,
  DeveloperReview,
  BugAttachment,
  SubmissionAttachment,
}) {}

export default BugTrackerModuleService
