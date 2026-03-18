// src/modules/client/index.ts
import { Module } from "@medusajs/framework/utils"
import ClientModuleService from "./service"

export const CLIENT_MODULE = "clientModuleService"

export default Module(CLIENT_MODULE, {
  service: ClientModuleService,
})