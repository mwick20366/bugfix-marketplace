import { model } from "@medusajs/framework/utils";
import Client from "./client";
import Submission from "./submission";
import Developer from "./developer";

const Bug = model.define("bug", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text(),
  tech_stack: model.text(),
  repo_link: model.text().nullable(),
  bounty: model.float().nullable(),
  status: model.text().nullable(),
  claimed_at: model.dateTime().nullable(),
  client: model.belongsTo(() => Client, { mappedBy: "bugs" }),
  developer: model.belongsTo(() => Developer, { mappedBy: "bugs" }).nullable(),
  submissions: model.hasMany(() => Submission, {
    mappedBy: "bug",
  }),
});

export default Bug;
