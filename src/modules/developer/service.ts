// src/modules/developer/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Developer from "./models/developer"

class DeveloperModuleService extends MedusaService({
  Developer,
}) {}

export default DeveloperModuleService