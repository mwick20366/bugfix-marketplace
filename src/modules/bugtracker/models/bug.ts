import { model } from "@medusajs/framework/utils";
import Client from "./client";
import Developer from "./developer";

const Bug = model.define("bug", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text(),
  techStack: model.text(),
  repoLink: model.text().nullable(),
  bounty: model.float().nullable(),
  status: model.text().nullable(),
  client: model.belongsTo(() => Client, { mappedBy: "bugs" }),
  developer: model.belongsTo(() => Developer, { mappedBy: "bugs" }).nullable(),

});

export default Bug;