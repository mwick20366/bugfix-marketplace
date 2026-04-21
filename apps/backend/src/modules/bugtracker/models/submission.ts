import { model } from "@medusajs/framework/utils";
import Developer from "./developer";
import Bug from "./bug";
import SubmissionAttachment from "./submission-attachment";

const Submission = model.define("submission", {
  id: model.id().primaryKey(),
  notes: model.text().nullable(),
  file_url: model.text().nullable(),
  status: model.text().nullable(),
  client_notes: model.text().nullable(),
  bug: model.belongsTo(() => Bug, { mappedBy: "submissions" }),
  developer: model.belongsTo(() => Developer, { mappedBy: "submissions" }).nullable(),
  attachments: model.hasMany(() => SubmissionAttachment, {
    mappedBy: "submission",
  }),  
});

export default Submission;