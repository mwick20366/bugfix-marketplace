import { model } from "@medusajs/framework/utils";
import Submission from "./submission";
import Client from "./client";
import Developer from "./developer";

const DeveloperReview = model.define("developer_review", {
  id: model.id().primaryKey(),
  rating: model.float(),
  notes: model.text().nullable(),
  developer: model.belongsTo(() => Developer, { mappedBy: "reviews" }),
  client: model.belongsTo(() => Client, { mappedBy: "reviews" }),
  submission: model.belongsTo(() => Submission, { mappedBy: "review" }),
}).checks([
  {
    name: "rating_range",
    expression: (columns) => `${columns.rating} >= 1 AND ${columns.rating} <= 5`,
  },
])

export default DeveloperReview