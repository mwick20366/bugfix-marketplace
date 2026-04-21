import { model } from "@medusajs/framework/utils";
import Submission from "./submission";

const SubmissionAttachment = model.define("submission_attachment", {
  id: model.id().primaryKey(),
  file_id: model.text(),
  file_url: model.text(),
  filename: model.text(),
  submission: model.belongsTo(() => Submission, { mappedBy: "attachments" }),
})

export default SubmissionAttachment