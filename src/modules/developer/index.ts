// src/modules/developer/index.ts
import { Module } from "@medusajs/framework/utils"
import DeveloperModuleService from "./service"

export const DEVELOPER_MODULE = "developerModuleService"

export default Module(DEVELOPER_MODULE, {
  service: DeveloperModuleService,
})