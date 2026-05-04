import { model } from "@medusajs/framework/utils";
import Bug from "./bug";
import Submission from "./submission";
import DeveloperReview from "./developer-review";

const Developer = model.define("developer", {
  id: model.id().primaryKey(),
  first_name: model.text(),
  last_name: model.text(),
  email: model.text(),
  tech_stack: model.text().nullable(),
  avatar_url: model.text().nullable(),
  stripe_account_id: model.text().nullable(),
  is_payout_ready: model.boolean().default(false),
  bugs: model.hasMany(() => Bug, {
    mappedBy: "developer",
  }),
  submissions: model.hasMany(() => Submission, {
    mappedBy: "developer",
  }),
  reviews: model.hasMany(() => DeveloperReview, {
    mappedBy: "developer",
  } )
});

export default Developer;