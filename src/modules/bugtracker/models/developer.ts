import { model } from "@medusajs/framework/utils";
import Bug from "./bug";
import Submission from "./submission";

const Developer = model.define("developer", {
  id: model.id().primaryKey(),
  first_name: model.text(),
  last_name: model.text(),
  email: model.text(),
  bugs: model.hasMany(() => Bug, {
    mappedBy: "developer",
  }),
  submissions: model.hasMany(() => Submission, {
    mappedBy: "developer",
  })
});

export default Developer;