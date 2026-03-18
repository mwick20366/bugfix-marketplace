// src/modules/client/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Client from "./models/client"

class ClientModuleService extends MedusaService({
  Client,
}) {}

export default ClientModuleService