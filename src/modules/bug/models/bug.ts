import { model } from "@medusajs/framework/utils";
import Client from "../../client/models/client";

const Bug = model.define("bug", {
  id: model.id().primaryKey(),
  client: model.belongsTo(() => Client, {
    mappedBy: "bugs",
  }),
  title: model.text(),
  description: model.text(),
  techStack: model.text(),
  repoLink: model.text().nullable(),
  bounty: model.float().nullable(),
  status: model.text().nullable(),
});

export default Bug;