// src/modules/bugtracker/index.ts
import BugTrackerModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BUGTRACKER_MODULE = "bugtracker"

export default Module(BUGTRACKER_MODULE, {
  service: BugTrackerModuleService,
})