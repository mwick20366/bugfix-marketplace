// src/modules/bug/index.ts
import { Module } from "@medusajs/framework/utils"
import BugModuleService from "./service"

export const BUG_MODULE = "bug"

export default Module(BUG_MODULE, {
  service: BugModuleService,
})