// src/modules/client/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Client from "./models/client"
import Developer from "./models/developer"
import Bug from "./models/bug"
import Submission from "./models/submission"

class BugTrackerModuleService extends MedusaService({
  Client,
  Developer,
  Bug,
  Submission,
}) {}

export default BugTrackerModuleService
