import { model } from "@medusajs/framework/utils";
import Bug from "./bug";

const Client = model.define("client", {
  id: model.id().primaryKey(),
  contact_first_name: model.text(),
  contact_last_name: model.text(),
  company_name: model.text(),
  email: model.text(),
  stripe_customer_id: model.text().nullable(), 
  avatar_url: model.text().nullable(),
  bugs: model.hasMany(() => Bug, {
    mappedBy: "client",
  }),
});

export default Client;