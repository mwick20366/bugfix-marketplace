// src/modules/client/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Client from "./models/client"
import Developer from "./models/developer"
import Bug from "./models/bug"

class ClientModuleService extends MedusaService({
  Client,
  Developer,
  Bug,
}) {}

export default ClientModuleService
