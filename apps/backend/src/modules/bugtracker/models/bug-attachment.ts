import { model } from "@medusajs/framework/utils"
import Bug from "./bug"

const BugAttachment = model.define("bug_attachment", {
  id: model.id().primaryKey(),
  file_id: model.text(),
  file_url: model.text(),
  filename: model.text(),
  bug: model.belongsTo(() => Bug, { mappedBy: "attachments" }),
})

export default BugAttachment
