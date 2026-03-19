// src/modules/bug/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Bug from "./models/bug"
import Client from "../client/models/client"

class BugModuleService extends MedusaService({
  Bug,
  Client,
}) {}

export default BugModuleService